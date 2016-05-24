/**
  * Representa os estados de validação do autômato.
  */
var AFD_MotivosRejeicao = {
    ACEITO: 0,
    NAO_FAZ_PARTE_DO_ALFABETO: 1,
    TRANSICAO_INEXISTENTE: 2,
    ESTADO_NAO_FINAL: 3
};

/**
  * Representa as transições que um determinado nó pode processar.
  * @constructor
  * @param {Array} simbolos - Um array de {Char} representando todos os símbolos que essa transição reconhece.
  * @param {int} destino - Representa a ordem do nó para onde essa transição levará.
  */
function Transicao(simbolos, destino) {
    var _simbolos = simbolos;
    var _destino = destino;

    /**
      * Retorna todos os símbolos reconhecidos por essa transição.
      */
    this.getSimbolos = function getSimbolos() {
        return _simbolos;
    }

    this.getDestino = function getDestino() {
        return _destino;
    }
}

/**
  * Representa um nó de um autômato
  * @constructor
  * @param {int} ordem - Um identificador único para o nó.
  * @param {string} rotulo - O nome que será dado ao nó, caso nenhum nome seja dado será usado q{ordem}.
  * @param {Boolean} final - Valor indicando se o nó representa um estado final ou não.
  * @param {Array} transicoes - Um array de {Transicao} contendo todas as transições reconhecidas por este nó.
  */
function No(ordem, rotulo, final, transicoes) {
    var _ordem = ordem;
    var _rotulo = rotulo;
    var _final = final;
    var _transicoes = transicoes;

    this.getFinal = function getFinal() {
        return _final;
    };

    this.getRotulo = function getRotulo() {
        return _rotulo;
    };

    /**
      * Retorna todas as transições desse nó.
      */
    this.getTransicoes = function getTransicoes() {
        return _transicoes;
    };

    /**
      * Retorna o nome do nó (que é o rótulo caso ele possua um, ou q{Ordem} caso contrário).
      */
    this.toString = function toString() {
        return _rotulo ? _rotulo.toString() : "q" + _ordem.toString();
    };
}

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
                return new Transicao(t.s, t.d);
            });
            return new No(no.o, no.r, no.f, transicoes)
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
                    resultado: AFD_MotivosRejeicao.NAO_FAZ_PARTE_DO_ALFABETO,
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
      * @returns {Object} Retorna AFD_MotivosRejeicao.ACEITO se a palavra for aceita pelo AFD, 
      *                   ou um objeto indicando qual o motivo da rejeição.
      */
    this.testarPalavra = function testarPalavra(palavra) {
        // por ora vamos assumir que o AFD aceita a palavra vazia
        if (!palavra || palavra.length <= 0)
            return AFD_MotivosRejeicao.ACEITO;

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
                    resultado: AFD_MotivosRejeicao.TRANSICAO_INEXISTENTE,
                    no: no,
                    processados: processados,
                    simbolo: palavra[i]
                };
            }
        }

        if (proximo == null || !proximo.getFinal()) {
            return {
                resultado: AFD_MotivosRejeicao.ESTADO_NAO_FINAL,
                proximo: proximo
            };
        }

        return AFD_MotivosRejeicao.ACEITO;
    }

    _init();
}