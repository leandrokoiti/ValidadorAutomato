(function (gerarAfdId, afdId, afdContainerId, txtAutomatoId, txtEntradaId, validarEntradaId, msgValidacaoId, btnValidarEntradaId) {
    var afd = null;

    $(document).ready(function () {
        var doc = CodeMirror.fromTextArea(document.getElementById("txt-automato"));

        $('pre code').each(function (i, block) {
            hljs.highlightBlock(block);
        });

        $(gerarAfdId).on("click", function () {
            $(afdId).remove();
            $(afdContainerId).html('<div id="' + afdId.replace("#", "") + '"></div>');

            afd = new AFD(doc.getValue());

            var nodeColor = "#CCC";
            var finalNodeColor = "#F00";
            var edgeColor = "#000";
            var labelColor = "#000";

            var s = new sigma({
                renderer: {
                    container: document.getElementById('afd'),
                    type: 'canvas'
                },
                settings: {
                    maxEdgeSize: 1,
                    minArrowSize: 10,
                    maxNodeSize: 10,
                    labelThreshold: 0,
                    labelSize: "proportional",
                    labelSizeRatio: 1.5,
                    defaultLabelColor: labelColor,
                    labelAlignment: "inside"
                }
            });

            s.graph.addNode({
                id: 'n-',
                x: 0.3,
                y: 0,
                size: 0,
                color: "#FFF"
            });

            var counter = 1;

            var nos = afd.getNos();
            var nLength = afd.getNos().length;

            var linhas = Math.round(Math.sqrt(nLength));
            var maiorNumeroColunas = Math.round(Math.pow(2, linhas - 1));

            for (var i = 0; i < nLength; ++i) {
                var linha = Math.round(Math.sqrt(i));
                var maxColunas = Math.round(Math.pow(2, linha - 1));

                var subIndice = i - linha;

                var node = afd.getNos()[i];

                var color = node.getFinal() ? finalNodeColor : nodeColor;
                var label = node.getRotulo();

                s.graph.addNode({
                    id: 'n' + i.toString(),
                    label: label,
                    x: (maiorNumeroColunas / (maxColunas + 1)) + subIndice / 2,
                    y: linha,
                    size: 1,
                    color: color
                });

                counter += 0.4;
            }

            s.graph.addEdge({
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

                        s.graph.addEdge({
                            id: 'en' + i.toString() + 'n' + t.getDestino().toString(),
                            // Reference extremities:
                            source: 'n' + i.toString(),
                            target: 'n' + t.getDestino().toString(),
                            label: '{' + t.getSimbolos().join(',') + '}',
                            color: edgeColor,
                            type: arrowType,
                            count: j
                        });
                    }
                }
            }
            s.refresh();

        });
        $(gerarAfdId).click();
        $(txtEntradaId).on("keydown", function () {
            $(validarEntradaId).removeClass("alert-success").removeClass("alert-danger");
            $(msgValidacaoId).html(null);
        });
        $(btnValidarEntradaId).on("click", function () {
            if (afd != null) {
                var w = $(txtEntradaId).val();

                var resposta = afd.testarPalavra(w);

                if (resposta === AFD_MotivosRejeicao.ACEITO) {
                    setEntradaValida("Palavra aceita!");
                } else if (resposta.resultado === AFD_MotivosRejeicao.NAO_FAZ_PARTE_DO_ALFABETO) {
                    setEntradaInvalida("O AFD não reconhece o símbolo '" + resposta.simbolo + "' pois seu alfabeto é: " + afd.getAlfabeto().join());
                } else if (resposta.resultado === AFD_MotivosRejeicao.TRANSICAO_INEXISTENTE) {
                    setEntradaInvalida("'" + resposta.simbolo + "' não possui transição em " + afd.getNomeNo(resposta.no) + ". Lido: " + resposta.processados.join());
                } else if (resposta.resultado === AFD_MotivosRejeicao.ESTADO_NAO_FINAL) {
                    if (resposta.proximo) {
                        setEntradaInvalida("AFD terminou em um estado não final (" + afd.getNomeNo(resposta.proximo) + ").");
                    }
                    else {
                        setEntradaInvalida("AFD terminou em um estado não final.");
                    }
                }
            }
        });
    });

    function setEntradaValida(msg) {
        $(validarEntradaId).addClass("alert-success");
        $(msgValidacaoId).html(msg);
    }
    function setEntradaInvalida(msg) {
        $(validarEntradaId).addClass("alert-danger");
        $(msgValidacaoId).html("Erro: " + msg);
    }
})("#gerar-afd", '#afd', '#afd-container', "#txt-automato", "#txt-entrada", "#msg-validacao", "#msg-validacao-aviso", "#validar-entrada");
