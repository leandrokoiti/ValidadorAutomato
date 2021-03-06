﻿(function () {
    var automato = null;
    var automato_renderer = null;

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
    var MSG_PILHA_NAO_VAZIA = "O autômato encerrou com a pilha não vazia.";

    $(document).ready(function () {
        // configura o codemirror
        $('pre code').each(function (i, block) {
            hljs.highlightBlock(block);
        });

        // evento ao clicar no botão "gerar afd"
        $(gerarAfdId).on("click", function () {
            gerarAutomato();
        });

        // evento disparado ao mudar algum texto na palavra para validar
        $(txtEntradaId).on("keydown", function () {
            limparValidacao();
        });

        // evento ao clicar no botão "validar"
        $(btnValidarEntradaId).on("click", function () {
            validarAutomato();
        });

        doc = CodeMirror.fromTextArea(document.getElementById(txtAutomatoId.replace("#", "")));

        // gera o afd de exemplo
        gerarAutomato();
    });

    function limparValidacao() {
        $(validarEntradaId).removeClass(classeValido).removeClass(classeInvalido);
        $(msgValidacaoId).html(null);
    };

    function validarAutomato() {
        if (automato != null) {
            var w = $(txtEntradaId).val();
            var resposta = automato.testarPalavra(w);
            if (resposta === Automato.MotivosRejeicao.ACEITO) {
                setEntradaValida(MSG_PALAVRA_ACEITA);
            } else if (resposta.resultado === Automato.MotivosRejeicao.NAO_FAZ_PARTE_DO_ALFABETO) {
                setEntradaInvalida(MSG_NAO_FAZ_PARTE_DO_ALFABETO.format(resposta.simbolo, automato.getAlfabeto().join()));
            } else if (resposta.resultado === Automato.MotivosRejeicao.TRANSICAO_INEXISTENTE) {
                setEntradaInvalida(MSG_TRANSICAO_INEXISTENTE.format(resposta.simbolo, resposta.no.toString(), resposta.processados.join()));
            } else if (resposta.resultado === Automato.MotivosRejeicao.ESTADO_NAO_FINAL) {
                if (resposta.proximo) {
                    setEntradaInvalida(MSG_ESTADO_NAO_FINAL_PROXIMO.format(resposta.proximo.toString()));
                }
                else {
                    setEntradaInvalida(MSG_ESTADO_NAO_FINAL);
                }
            } else if (resposta.resultado === Automato.MotivosRejeicao.PILHA_NAO_VAZIA) {
                setEntradaInvalida(MSG_PILHA_NAO_VAZIA);
            }
        }
    };

    function gerarAutomato() {
        $(afdId).remove();
        $(afdContainerId).html('<div id="' + afdId.replace("#", "") + '"></div>');

        var canvas = document.getElementById(afdId.replace("#", ""));

        var automato = Automato.Factory.CriarInstancia(doc.getValue());
        var tipoAutomato = automato.getTipoAutomato();
        $("#tipo-automato").html(tipoAutomato);

        if (tipoAutomato === Automato.AFD.GetTipoAutomato()) {
            automato_renderer = new Automato.AFD.Renderer.Default(automato, canvas);
        } else if (tipoAutomato === Automato.AFND.GetTipoAutomato()) {
            automato_renderer = new Automato.AFD.Renderer.Default(automato, canvas);
        } else if (tipoAutomato === Automato.AP.GetTipoAutomato()) {
            automato_renderer = new Automato.AFD.Renderer.Default(automato, canvas);
        }

        automato_renderer.render();
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