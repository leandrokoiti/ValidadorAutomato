var Automato = Automato || {};
/**
  * Representa um AP (Autômato com Pilha)
  * @constructor
  * @param {string} JSON - O json que será utilizado para criar o AP.
  */
Automato.AP = function (JSON) {
    /**
      * Invoca o construtor base
      */
    Automato.AFBase.call(this, JSON);

    /**
      * Retorna o nome do tipo de autômato identificado a partir das regras criadas.
      */
    this.getTipoAutomato = function getTipoAutomato() {
        return Automato.AP.GetTipoAutomato();
    }

    /**
      * Testa a palavra informada no AP gerado.
      * @param {string} Palavra que será testada no AP
      * @returns {Object} Retorna Automato.MotivosRejeicao.ACEITO se a palavra for aceita pelo AP, 
      *                   ou um objeto indicando qual o motivo da rejeição.
      */
    this.testarPalavra = function testarPalavra(palavra) {
        // por ora vamos assumir que o AP aceita a palavra vazia
        if (!palavra || palavra.length <= 0)
            return Automato.MotivosRejeicao.ACEITO;

        // verifica se o AP aceita todos os símbolos da palavra informada
        var isValida = this.isPalavraValida(palavra);

        if (isValida !== true)
            return isValida;

        // testa a palavra
        var no = [this._nos[0]];
        var processados = [];
        for (var i = 0; i < palavra.length; ++i) {
            var proximo = [];
            processados.push(palavra[i]);
            var transicoes = no.map(function(n){return n.getTransicoes()});
            var tLength = transicoes.length;

            if (tLength > 0) {
                for (var j = 0; j < tLength; ++j) {
                    var transicao = transicoes[j];
                    var simbolos = transicao.map(function(s){return s.getSimbolos()});
                    if (simbolos.some(function (x) {
                        return x.some(function (p) {
                            return p.toString() == palavra[i].toString();
                        });
                    })) {
                        proximo.push(this._nos[parseInt(transicao.map(function(d){return d.getDestino();}))]);
                    }
                }
            }

            if (proximo != null && proximo.length > 0) {
                no = proximo;
            } else {
                return {
                    resultado: Automato.MotivosRejeicao.TRANSICAO_INEXISTENTE,
                    no: no,
                    processados: processados,
                    simbolo: palavra[i]
                };
            }
        }

        if (proximo == null || !proximo.some(function (p) { return p.getFinal(); })) {
            return {
                resultado: Automato.MotivosRejeicao.ESTADO_NAO_FINAL,
                proximo: proximo
            };
        }

        return Automato.MotivosRejeicao.ACEITO;
    }
}
Automato.AP.GetTipoAutomato = function () { return "AP" };