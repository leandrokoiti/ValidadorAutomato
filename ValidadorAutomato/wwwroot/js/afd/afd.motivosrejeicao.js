﻿AFD = AFD || {};
/**
  * Representa os estados de validação do autômato.
  */
AFD.MotivosRejeicao = {
    ACEITO: 0,
    NAO_FAZ_PARTE_DO_ALFABETO: 1,
    TRANSICAO_INEXISTENTE: 2,
    ESTADO_NAO_FINAL: 3
};