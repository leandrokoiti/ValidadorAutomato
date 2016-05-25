var Automato = Automato || {};
/**
  * Representa o renderizador do grafo de um autômato
  * @constructor
  * @param {AFD} afd - O autômato que será utilizado para renderizar.
  * @param {HTMLElement} el - O elemento onde o grafo será renderizado.
  * @param {Object} settings - As configurações do sigma.js. Se nada for passado usa configurações padrão.
  */
Automato.RendererBase = function (afd, el) {
    if (arguments.length == 0) return;

    this._afd = afd;
    this._el = el;

    this.render = function () { throw Automato.Mensagens.METODO_NAO_IMPLEMENTADO; };
}