﻿(function () {
    var afd = null;
    var afd_renderer = null;

    var gerarAfdId = "#gerar-afd";
    var afdId = '#afd';
    var afdContainerId = '#afd-container';
    var txtAutomatoId = "#txt-automato";
    var txtEntradaId = "#txt-entrada";
    var validarEntradaId = "#msg-validacao";
    var msgValidacaoId = "#msg-validacao-aviso";
    var btnValidarEntradaId = "#validar-entrada";

    var doc = null;

    var classeValido = "alert-success";
    var classeInvalido = "alert-danger";

    var MSG_NAO_FAZ_PARTE_DO_ALFABETO = "O AFD não reconhece o símbolo '{0}' pois seu alfabeto é: {1}";
    var MSG_TRANSICAO_INEXISTENTE = "'{0}' não possui transição em {1}. Lido: {2}";
    var MSG_ESTADO_NAO_FINAL_PROXIMO = "AFD terminou em um estado não final ({0}).";
    var MSG_ESTADO_NAO_FINAL = "AFD terminou em um estado não final.";
    var MSG_PALAVRA_ACEITA = "Palavra aceita!";

    $(document).ready(function () {
        // configura o codemirror
        $('pre code').each(function (i, block) {
            hljs.highlightBlock(block);
        });

        // evento ao clicar no botão "gerar afd"
        $(gerarAfdId).on("click", function () {
            gerarAfd();
        });

        // evento disparado ao mudar algum texto na palavra para validar
        $(txtEntradaId).on("keydown", function () {
            limparValidacao();
        });

        // evento ao clicar no botão "validar"
        $(btnValidarEntradaId).on("click", function () {
            validarAfd();
        });

        doc = CodeMirror.fromTextArea(document.getElementById(txtAutomatoId.replace("#", "")));

        // gera o afd de exemplo
        gerarAfd();
    });

    function limparValidacao() {
        $(validarEntradaId).removeClass(classeValido).removeClass(classeInvalido);
        $(msgValidacaoId).html(null);
    };

    function validarAfd() {
        if (afd != null) {
            var w = $(txtEntradaId).val();
            var resposta = afd.testarPalavra(w);
            if (resposta === Automato.MotivosRejeicao.ACEITO) {
                setEntradaValida(MSG_PALAVRA_ACEITA);
            } else if (resposta.resultado === Automato.MotivosRejeicao.NAO_FAZ_PARTE_DO_ALFABETO) {
                setEntradaInvalida(MSG_NAO_FAZ_PARTE_DO_ALFABETO.format(resposta.simbolo, afd.getAlfabeto().join()));
            } else if (resposta.resultado === Automato.MotivosRejeicao.TRANSICAO_INEXISTENTE) {
                setEntradaInvalida(MSG_TRANSICAO_INEXISTENTE.format(resposta.simbolo, afd.getNomeNo(resposta.no), resposta.processados.join()));
            } else if (resposta.resultado === Automato.MotivosRejeicao.ESTADO_NAO_FINAL) {
                if (resposta.proximo) {
                    setEntradaInvalida(MSG_ESTADO_NAO_FINAL_PROXIMO.format(afd.getNomeNo(resposta.proximo)));
                }
                else {
                    setEntradaInvalida(MSG_ESTADO_NAO_FINAL);
                }
            }
        }
    };

    function gerarAfd() {
        $(afdId).remove();
        $(afdContainerId).html('<div id="' + afdId.replace("#", "") + '"></div>');

        afd = new Automato.AFD(doc.getValue());
        afd_renderer = new Automato.AFD.Renderer.Default(afd, document.getElementById(afdId.replace("#", "")));
        afd_renderer.render();
    };

    function setEntradaValida(msg) {
        $(validarEntradaId).addClass(classeValido);
        $(msgValidacaoId).html(msg);
    }

    function setEntradaInvalida(msg) {
        $(validarEntradaId).addClass(classeInvalido);
        $(msgValidacaoId).html("Erro: " + msg);
    }

})();