var Automato = Automato || {};
/**
  * Representa as transições que um determinado nó pode processar.
  * @constructor
  * @param {Array} simbolos - Um array de {Char} representando todos os símbolos que essa transição reconhece.
  * @param {int} destino - Representa a ordem do nó para onde essa transição levará.
  */
Automato.Transicao = function (simbolos, destino, removerDaPilha, adicionarNaPilha) {
    var _simbolos = simbolos;
    var _destino = destino;
    var _removerDaPilha = removerDaPilha;
    var _adicionarNaPilha = adicionarNaPilha;

    /**
      * Retorna todos os símbolos reconhecidos por essa transição.
      */
    this.getSimbolos = function getSimbolos() {
        return _simbolos;
    }

    /**
      * Retorna o nó de destino para onde essa transição leva.
      */
    this.getDestino = function getDestino() {
        return _destino;
    }

    /**
      * Retorna os símbolos que serão removidos da pilha ao efetuar a transição.
      */
    this.getRemoverPilha = function getRemoverPilha() {
        return _removerDaPilha;
    }

    /**
      * Retorna os símbolos que serão aidicionados na pilha ao efetuar a transição.
      */
    this.getAdicionarPilha = function getAdicionarPilha() {
        return _adicionarNaPilha;
    }
}