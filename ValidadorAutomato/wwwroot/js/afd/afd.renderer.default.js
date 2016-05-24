AFD = AFD || {};
AFD.Renderer = AFD.Renderer || {};
/**
  * Representa o renderizador do grafo de um autômato
  * @constructor
  * @param {AFD} afd - O autômato que será utilizado para renderizar.
  * @param {HTMLElement} el - O elemento onde o grafo será renderizado.
  * @param {Object} settings - As configurações do sigma.js. Se nada for passado usa configurações padrão.
  */
AFD.Renderer.Default = function(afd, el, settings) {
    var _afd = afd;
    var _el = el;
    var _nodeColor = "#CCC";
    var _finalNodeColor = "#F00";
    var _edgeColor = "#000";
    var _labelColor = "#000";
    var _sigma = null;
    var _settings = settings || {
        maxEdgeSize: 1,
        minArrowSize: 10,
        maxNodeSize: 10,
        labelThreshold: 0,
        labelSize: "proportional",
        labelSizeRatio: 1.5,
        defaultLabelColor: _labelColor,
        labelAlignment: "inside"
    };

    var init = function() {
        _sigma = new sigma({
            renderer: {
                container: _el,
                type: 'canvas'
            },
            settings: _settings
        });

        _sigma.graph.addNode({
            id: 'n-',
            x: 0.3,
            y: 0,
            size: 0,
            color: "#FFF"
        });
    }

    this.render = function() {
        var counter = 1;

        var nos = _afd.getNos();
        var nLength = _afd.getNos().length;

        var linhas = Math.round(Math.sqrt(nLength));
        var maiorNumeroColunas = Math.round(Math.pow(2, linhas - 1));

        for (var i = 0; i < nLength; ++i) {
            var linha = Math.round(Math.sqrt(i));
            var maxColunas = Math.round(Math.pow(2, linha - 1));

            var subIndice = i - linha;

            var node = _afd.getNos()[i];

            var color = node.getFinal() ? _finalNodeColor : _nodeColor;
            var label = node.getRotulo();

            _sigma.graph.addNode({
                id: 'n' + i.toString(),
                label: label,
                x: (maiorNumeroColunas / (maxColunas + 1)) + subIndice / 2,
                y: linha,
                size: 1,
                color: color
            });

            counter += 0.4;
        }

        _sigma.graph.addEdge({
            id: 'en-',
            source: 'n-',
            target: 'n0',
            color: "#CCC",
            type: 'arrow',
            count: 0
        })

        for (var i = 0; i < nLength; ++i) {
            var node = nos[i];

            var transicoes = node.getTransicoes();
            var tLength = transicoes.length;
            if (tLength > 0) {
                for (j = 0; j < tLength; ++j) {
                    var t = transicoes[j];

                    var arrowType = i == t.getDestino() || t.getDestino() < i ? 'curvedArrow' : 'arrow';

                    _sigma.graph.addEdge({
                        id: 'en' + i.toString() + 'n' + t.getDestino().toString(),
                        // Reference extremities:
                        source: 'n' + i.toString(),
                        target: 'n' + t.getDestino().toString(),
                        label: '{' + t.getSimbolos().join(',') + '}',
                        color: _edgeColor,
                        type: arrowType,
                        count: j
                    });
                }
            }
        }
        _sigma.refresh();
    };

    init();
}