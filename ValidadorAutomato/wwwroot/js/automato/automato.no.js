var Automato = Automato || {};
/**
  * Representa um nó de um autômato
  * @constructor
  * @param {int} ordem - Um identificador único para o nó.
  * @param {string} rotulo - O nome que será dado ao nó, caso nenhum nome seja dado será usado q{ordem}.
  * @param {Boolean} final - Valor indicando se o nó representa um estado final ou não.
  * @param {Array} transicoes - Um array de {Transicao} contendo todas as transições reconhecidas por este nó.
  */
Automato.No = function (ordem, rotulo, final, transicoes) {
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