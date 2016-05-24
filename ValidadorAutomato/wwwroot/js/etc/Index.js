(function (gerarAfdId, afdId, afdContainerId, txtAutomatoId, txtEntradaId, validarEntradaId, msgValidacaoId, btnValidarEntradaId) {
    var afd = null;
    var afd_renderer = null;

    $(document).ready(function () {
        var doc = CodeMirror.fromTextArea(document.getElementById("txt-automato"));

        $('pre code').each(function (i, block) {
            hljs.highlightBlock(block);
        });

        $(gerarAfdId).on("click", function () {
            $(afdId).remove();
            $(afdContainerId).html('<div id="' + afdId.replace("#", "") + '"></div>');

            afd = new AFD(doc.getValue());
            afd_renderer = new AFD.Renderer.Default(afd, document.getElementById('afd'))
            afd_renderer.render();
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
