var Automato = Automato || {};
/**
  * Representa um AF (Autômato Finito)
  * @constructor
  * @param {string} JSON - O json que será utilizado para criar o AF.
  */
Automato.AFBase = function (JSON) {
    if (arguments.length == 0) return;

    this._json = JSON;
    this._nos = null;
    this._alfabeto = null;
    this._init = function () {
        // converte o json em nós
        this._nos = eval(this._json).sort(function (a, b) {
            if (a.o < b.o) {
                return -1;
            }
            if (a.o > b.o) {
                return 1;
            }
            return 0;
        }).map(function (no) {
            var transicoes = (no.t ? no.t : []).map(function (t) {
                return new Automato.Transicao(t.s, t.d, t.rp, t.ap);
            });
            return new Automato.No(no.o, no.r, no.f, transicoes)
        });

        // define o alfabeto que é reconhecido
        this._alfabeto = [];
        for (var i = 0; i < this._nos.length; ++i) {
            var transicoes = this._nos[i].getTransicoes();
            for (var j = 0; j < transicoes.length; ++j) {
                var simbolosDaTransicao = transicoes[j].getSimbolos();
                for (var k = 0; k < simbolosDaTransicao.length; ++k) {
                    if (!this._alfabeto.some(function (x) {
                        return x.toString() == simbolosDaTransicao[k].toString();
                    })) {
                        this._alfabeto.push(simbolosDaTransicao[k]);
                    }
                }
            }
        }
    };

    /**
      * Retorna todos os nós do AF criado.
      */
    this.getNos = function getNos() {
        return this._nos;
    };

    /**
      * Retorna o alfabeto reconhecido pelo AF criado.
      */
    this.getAlfabeto = function getAlfabeto() {
        return this._alfabeto;
    };

    /**
      * Retorna um Boolean indicando se todos os símbolos da palavra informada possuem pelo menos uma transição dentro do AF.
      * @param {string} palavra - Palavra que será verificada.
      * @returns {Boolean} Retorna 'true' se todos os símbolos da palavra possuírem pelo menos uma transição dentro do AF, 'false' caso contrário.
      */
    this.isPalavraValida = function isPalavraValida(palavra) {
        for (var i = 0; i < palavra.length; ++i) {
            if (!this._alfabeto.some(function (x) {
                return x.toString() == palavra[i].toString();
            })) {
                return {
                    resultado: Automato.MotivosRejeicao.NAO_FAZ_PARTE_DO_ALFABETO,
                    simbolo: palavra[i]
                };
            }
        }
        return true;
    }

    /**
      * Retorna o nome do tipo de autômato identificado a partir das regras criadas.
      */
    this.getTipoAutomato = function getTipoAutomato() { throw Automato.Mensagens.METODO_NAO_IMPLEMENTADO; }

    /**
      * Testa a palavra informada no AF gerado.
      * @param {string} Palavra que será testada no AF
      * @returns {Object} Retorna Automato.MotivosRejeicao.ACEITO se a palavra for aceita pelo AF, 
      *                   ou um objeto indicando qual o motivo da rejeição.
      */
    this.testarPalavra = function testarPalavra(palavra) { throw Automato.Mensagens.METODO_NAO_IMPLEMENTADO; }

    this._init();
}