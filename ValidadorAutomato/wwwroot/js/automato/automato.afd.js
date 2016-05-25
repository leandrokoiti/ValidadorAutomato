var Automato = Automato || {};
/**
  * Representa um AFD (Autômato Finito Determinístico)
  * @constructor
  * @param {string} JSON - O json que será utilizado para criar o AFD.
  */
Automato.AFD = function (JSON) {
    /**
      * Invoca o construtor base
      */
    Automato.AFBase.call(this, JSON);

    /**
      * Testa a palavra informada no AFD gerado.
      * @param {string} Palavra que será testada no AFD
      * @returns {Object} Retorna Automato.MotivosRejeicao.ACEITO se a palavra for aceita pelo AFD, 
      *                   ou um objeto indicando qual o motivo da rejeição.
      */
    this.testarPalavra = function testarPalavra(palavra) {
        // por ora vamos assumir que o AFD aceita a palavra vazia
        if (!palavra || palavra.length <= 0)
            return Automato.MotivosRejeicao.ACEITO;

        // verifica se o AFD aceita todos os símbolos da palavra informada
        var isValida = this.isPalavraValida(palavra);

        if (isValida !== true)
            return isValida;

        // testa a palavra
        var no = this._nos[0];
        var processados = [];
        for (var i = 0; i < palavra.length; ++i) {
            var proximo = null;
            processados.push(palavra[i]);
            var transicoes = no.getTransicoes();
            var tLength = transicoes.length;

            if (tLength > 0) {
                for (var j = 0; j < tLength; ++j) {
                    var transicao = transicoes[j];
                    var simbolos = transicao.getSimbolos();
                    if (simbolos.some(function (x) {
                        return x.toString() == palavra[i].toString();
                    })) {
                        proximo = this._nos[parseInt(transicao.getDestino())];
                    }
                }
            }

            if (proximo != null) {
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

        if (proximo == null || !proximo.getFinal()) {
            return {
                resultado: Automato.MotivosRejeicao.ESTADO_NAO_FINAL,
                proximo: proximo
            };
        }

        return Automato.MotivosRejeicao.ACEITO;
    }
}