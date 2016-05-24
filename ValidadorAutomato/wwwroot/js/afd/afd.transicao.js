AFD = AFD || {};
/**
  * Representa as transições que um determinado nó pode processar.
  * @constructor
  * @param {Array} simbolos - Um array de {Char} representando todos os símbolos que essa transição reconhece.
  * @param {int} destino - Representa a ordem do nó para onde essa transição levará.
  */
AFD.Transicao = function(simbolos, destino) {
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