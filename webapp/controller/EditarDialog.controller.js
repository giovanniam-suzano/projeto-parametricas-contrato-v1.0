sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("com.parametricas.parametricasapp.controller.EditarDialog", {
        
        constructor: function (oView) { 
            this._oView = oView; 
        },

        onNegociar: function () {
            var oModel = this._oView.byId("dialogParametricas").getModel("dialog");
            oModel.setProperty("/isNegociando", true);
            // Reseta a checkbox ao entrar na negociação para garantir estado limpo
            oModel.setProperty("/alterarReajusteTotal", false);
        },

        onCancelarNegociacao: function () {
            var oModel = this._oView.byId("dialogParametricas").getModel("dialog");
            oModel.setProperty("/isNegociando", false);
            oModel.setProperty("/alterarReajusteTotal", false);
            MessageToast.show("Negociação cancelada.");
        },

        onAdicionarIndice: function (oEvent) {
            var oComboBox = oEvent.getSource();
            var oModel = oComboBox.getModel("dialog");
            var oCtx = oComboBox.getBindingContext("dialog");
            var sPath = oCtx.getPath().substring(0, oCtx.getPath().lastIndexOf("/"));
            var aIndices = oModel.getProperty(sPath);
            if (oComboBox.getSelectedKey() === "SIM") {
                // Mantendo negociacaoReajuste vazio para novos índices
                aIndices.push({ 
                    ordem: aIndices.length + 1, 
                    tipoIndice: "", 
                    peso: "", 
                    reajusteProjetado: "0.0", 
                    negociacaoReajuste: "",
                    addMore: "NAO" 
                });
            } else {
                aIndices.splice(aIndices.indexOf(oCtx.getObject()) + 1);
            }
            oModel.setProperty(sPath, aIndices);
            oModel.refresh(true);
        },

        onAdicionarIndiceGlobal: function (oEvent) {
            var oModel = oEvent.getSource().getModel("dialog");
            var aIndices = oModel.getProperty("/globalIndices");
            if (oEvent.getSource().getSelectedKey() === "SIM") {
                aIndices.push({ 
                    ordem: aIndices.length + 1, 
                    tipoIndice: "", 
                    peso: "", 
                    reajusteProjetado: "0.0", 
                    negociacaoReajuste: "",
                    addMore: "NAO" 
                });
            } else {
                aIndices.splice(aIndices.indexOf(oEvent.getSource().getBindingContext("dialog").getObject()) + 1);
            }
            oModel.setProperty("/globalIndices", aIndices);
            oModel.refresh(true);
        },

        // Demais funções onPesoChange, onDialogProximo, onDialogVoltar e onDialogCancel mantidas
        onAplicarReajuste: function () {
            MessageToast.show("Reajuste aplicado com sucesso!");
            this.onDialogCancel();
        },

        onSalvarNegociacao: function () {
            var oModel = this._oView.byId("dialogParametricas").getModel("dialog");
            oModel.setProperty("/isNegociando", false);
            MessageToast.show("Negociação salva (estado atualizado).");
        },

        onDialogProximo: function () {
            var oModel = this._oView.byId("dialogParametricas").getModel("dialog");
            var iCurrent = oModel.getProperty("/currentIndex");
            oModel.setProperty("/currentIndex", iCurrent + 1);
            oModel.setProperty("/currentItem", oModel.getProperty("/selectedItems")[iCurrent + 1]);
            oModel.setProperty("/isNegociando", false); 
        },

        onDialogVoltar: function () {
            var oModel = this._oView.byId("dialogParametricas").getModel("dialog");
            var iCurrent = oModel.getProperty("/currentIndex");
            oModel.setProperty("/currentIndex", iCurrent - 1);
            oModel.setProperty("/currentItem", oModel.getProperty("/selectedItems")[iCurrent - 1]);
            oModel.setProperty("/isNegociando", false); 
        },

        onDialogCancel: function () {
            var oDialog = this._oView.byId("dialogParametricas");
            if (oDialog) {
                oDialog.getModel("dialog").setProperty("/isNegociando", false);
                oDialog.close();
            }
        }
    });
});