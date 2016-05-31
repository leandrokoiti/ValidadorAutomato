var Automato = Automato || {};
/**
  * Representa um AF (Autômato Finito)
  * @constructor
  * @param {string} JSON - O json que será utilizado para criar o AF.
  */
Automato.Factory = {
    CriarInstancia: function (json) {
        var af = new Automato.AFBase(json);
        var nos = af.getNos();

        // verifica se possui pilha em alguma transição, se possuir é um autômato com pilha
        for (var i = 0; i < nos.length; ++i) {
            var no = nos[i];
            var transicoes = no.getTransicoes();
            var tLength = transicoes.length;
            for (var j = 0; j < tLength; ++j) {
                var t = transicoes[j];
                if ( (t.getRemoverPilha() && t.getRemoverPilha.length > 0) ||
                    t.getAdicionarPilha() && t.getAdicionarPilha().length > 0) {
                    return new Automato.AP(json);
                }
            }
        }

        // como não é um AP, verifica se é um AFND olhando se existem transições vazias ou 
        // transições com o mesmo símbolo para destinos diferentes
        for (var i = 0; i < nos.length; ++i) {
            var no = nos[i];
            var transicoes = no.getTransicoes();

            // verifica as transições vazias
            if (transicoes.some(function (t) {
                return !t.getSimbolos() || t.getSimbolos().length <= 0;
            })) {
                return new Automato.AFND(json);
            };

            // verifica se existem símbolos iguais em transições diferentes
            var tLength = transicoes.length;
            for (var j = 0; j < tLength; ++j) {
                var t1 = transicoes[j];
                for (k = j+1; k < tLength; ++k) {
                    var t2 = transicoes[k];

                    if (t1.getSimbolos().some(function (sA) {
                        return t2.getSimbolos().some(function (sB) {
                            return sA == sB;
                        });
                    })) {
                        return new Automato.AFND(json);
                    }
                }
            }
        }

        // como não é um AP nem um AFND, assume que é um AFD
        return new Automato.AFD(json);
    }
};