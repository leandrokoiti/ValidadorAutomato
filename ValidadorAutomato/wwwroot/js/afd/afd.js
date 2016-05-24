/**
  * Representa um AFD
  * @constructor
  * @param {string} JSON - O json que será utilizado para criar o AFD.
  */
function AFD(JSON) {
    var _json = JSON;
    var _nos = null;
    var _alfabeto = null;
    var _init = function () {
        // converte o json em nós
        _nos = eval(_json).sort(function (a, b) {
            if (a.o < b.o) {
                return -1;
            }
            if (a.o > b.o) {
                return 1;
            }
            return 0;
        }).map(function (no) {
            var transicoes = (no.t ? no.t : []).map(function (t) {
                return new AFD.Transicao(t.s, t.d);
            });
            return new AFD.No(no.o, no.r, no.f, transicoes)
        });

        // define o alfabeto que é reconhecido
        _alfabeto = [];
        for (var i = 0; i < _nos.length; ++i) {
            var transicoes = _nos[i].getTransicoes();
            for (var j = 0; j < transicoes.length; ++j) {
                var simbolosDaTransicao = transicoes[j].getSimbolos();
                for (var k = 0; k < simbolosDaTransicao.length; ++k) {
                    if (!_alfabeto.some(function (x) {
                        return x.toString() == simbolosDaTransicao[k].toString();
                    })) {
                        _alfabeto.push(simbolosDaTransicao[k]);
                    }
                }
            }
        }
    };

    /**
      * Retorna todos os nós do AFD criado.
      */
    this.getNos = function getNos() {
        return _nos;
    };

    /**
      * Retorna o alfabeto reconhecido pelo AFD criado.
      */
    this.getAlfabeto = function getAlfabeto() {
        return _alfabeto;
    };

    /**
      * Retorna um Boolean indicando se todos os símbolos da palavra informada possuem pelo menos uma transição dentro do AFD.
      * @param {string} palavra - Palavra que será verificada.
      * @returns {Boolean} Retorna 'true' se todos os símbolos da palavra possuírem pelo menos uma transição dentro do AFD, 'false' caso contrário.
      */
    var isPalavraValida = function isPalavraValida(palavra) {
        for (var i = 0; i < palavra.length; ++i) {
            if (!_alfabeto.some(function (x) {
                return x.toString() == palavra[i].toString();
            })) {
                return {
                    resultado: AFD.MotivosRejeicao.NAO_FAZ_PARTE_DO_ALFABETO,
                    simbolo: palavra[i]
                };
            }
        }
        return true;
    }

    /**
      * Retorna um Boolean indicando se todos os símbolos da palavra informada possuem pelo menos uma transição dentro do AFD.
      * @param {string} palavra - Palavra que será verificada.
      * @returns {Boolean} Retorna 'true' se todos os símbolos da palavra possuírem pelo menos uma transição dentro do AFD, 'false' caso contrário.
      */
    this.getNomeNo = function getNomeNo(no) {
        return no.toString();
    }

    /**
      * Testa a palavra informada no AFD gerado.
      * @param {string} Palavra que será testada no AFD
      * @returns {Object} Retorna AFD.MotivosRejeicao.ACEITO se a palavra for aceita pelo AFD, 
      *                   ou um objeto indicando qual o motivo da rejeição.
      */
    this.testarPalavra = function testarPalavra(palavra) {
        // por ora vamos assumir que o AFD aceita a palavra vazia
        if (!palavra || palavra.length <= 0)
            return AFD.MotivosRejeicao.ACEITO;

        // verifica se o AFD aceita todos os símbolos da palavra informada
        var isValida = isPalavraValida(palavra);

        if (isValida !== true)
            return isValida;

        // testa a palavra
        var no = _nos[0];
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
                        proximo = _nos[parseInt(transicao.getDestino())];
                    }
                }
            }

            if (proximo != null) {
                no = proximo;
            } else {
                return {
                    resultado: AFD.MotivosRejeicao.TRANSICAO_INEXISTENTE,
                    no: no,
                    processados: processados,
                    simbolo: palavra[i]
                };
            }
        }

        if (proximo == null || !proximo.getFinal()) {
            return {
                resultado: AFD.MotivosRejeicao.ESTADO_NAO_FINAL,
                proximo: proximo
            };
        }

        return AFD.MotivosRejeicao.ACEITO;
    }

    _init();
}