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

            afd = eval(doc.getValue()).sort(function (a, b) {
                if (a.o < b.o) {
                    return -1;
                }
                if (a.o > b.o) {
                    return 1;
                }
                return 0;
            });

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

            var linhas = Math.round(Math.sqrt(afd.length));
            var maiorNumeroColunas = Math.round(Math.pow(2, linhas - 1));

            for (var i = 0; i < afd.length; ++i) {
                var linha = Math.round(Math.sqrt(i));
                var maxColunas = Math.round(Math.pow(2, linha - 1));

                var subIndice = i - linha;

                var node = afd[i];

                var color = node.f ? finalNodeColor : nodeColor;
                var label = node.r ? node.r : "q" + i.toString();

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

            for (var i = 0; i < afd.length; ++i) {
                var node = afd[i];

                if (node.t)
                    for (j = 0; j < node.t.length; ++j) {
                        var t = node.t[j];

                        var arrowType = i == t.d || t.d < i ? 'curvedArrow' : 'arrow';

                        s.graph.addEdge({
                            id: 'en' + i.toString() + 'n' + t.d.toString(),
                            // Reference extremities:
                            source: 'n' + i.toString(),
                            target: 'n' + t.d.toString(),
                            label: '{' + t.s.join(',') + '}',
                            color: edgeColor,
                            type: arrowType,
                            count: j
                        });
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

                var linguagem = [];
                for (var i = 0; i < afd.length; ++i) {
                    var t = afd[i].t;
                    for (var j = 0; j < t.length; ++j) {
                        var s = t[j].s;
                        for (var k = 0; k < s.length; ++k) {
                            if (!linguagem.some(function (x) {
                            return x.toString() == s[k].toString();
                            })) {
                                linguagem.push(s[k]);
                            }
                        }
                    }
                }

                for (var i = 0; i < w.length; ++i)
                    if (!linguagem.some(function (x) {
                        return x.toString() == w[i].toString();
                    })) {
                        setEntradaInvalida("O AFD não reconhece o símbolo '" + w[i] + "' pois seu alfabeto é: " + linguagem.join());
                        return;
                    }

                if (w.length <= 0) {
                    setEntradaValida("Palavra aceita!");
                } else {
                    var s = afd[0];
                    var processados = [];
                    for (var i = 0; i < w.length; ++i) {
                        var proximo = null;
                        processados.push(w[i]);
                        if (s.t)
                            for (var j = 0; j < s.t.length; ++j) {
                                var t = s.t[j];
                                if (t.s.some(function (x) {
                                    return x.toString() == w[i].toString();
                                })) {
                                    proximo = afd[parseInt(t.d)];
                                }
                            }
                        if (proximo != null) {
                            s = proximo;
                        } else {
                            setEntradaInvalida("'" + w[i] + "' não possui transição em q" + s.o + ". Lido: " + processados.join());
                            return;
                        }
                    }
                    if (proximo == null || !proximo.f) {
                        if (proximo) {
                            var nomeNo = proximo.r ? proximo.r.toString() : "q" + proximo.o.toString();
                            setEntradaInvalida("AFD terminou em um estado não final (" + nomeNo + ").");
                        }
                        else {
                            setEntradaInvalida("AFD terminou em um estado não final.");
                        }
                    }
                    else {
                        setEntradaValida("Palavra aceita!");
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
