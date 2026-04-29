sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("com.parametricas.parametricasapp.controller.ParametricasDialog", {
        constructor: function (oView) { this._oView = oView; },

        onAdicionarIndice: function (oEvent) {
            var oComboBox = oEvent.getSource();
            var oModel = oComboBox.getModel("dialog");
            var oCtx = oComboBox.getBindingContext("dialog");
            var sPath = oCtx.getPath().substring(0, oCtx.getPath().lastIndexOf("/"));
            var aIndices = oModel.getProperty(sPath);
            if (oComboBox.getSelectedKey() === "SIM") {
                aIndices.push({ ordem: aIndices.length + 1, tipoIndice: "", peso: "", addMore: "NAO" });
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
                aIndices.push({ ordem: aIndices.length + 1, tipoIndice: "", peso: "", addMore: "NAO" });
            } else {
                aIndices.splice(aIndices.indexOf(oEvent.getSource().getBindingContext("dialog").getObject()) + 1);
            }
            oModel.setProperty("/globalIndices", aIndices);
            oModel.refresh(true);
        },

        onAdicionarIndiceCadastro: function (oEvent) {
            var oModel = oEvent.getSource().getModel("dialog");
            var aIndices = oModel.getProperty("/indicesCadastro");
            if (oEvent.getSource().getSelectedKey() === "SIM") {
                aIndices.push({ ordem: aIndices.length + 1, valor: "", tipoIndice: "", peso: "", dataBaseParametrica: "", addMore: "NAO" });
            } else {
                aIndices.splice(aIndices.indexOf(oEvent.getSource().getBindingContext("dialog").getObject()) + 1);
            }
            oModel.setProperty("/indicesCadastro", aIndices);
            oModel.refresh(true);
        },

        onPesoChange: function (oEvent) {
            var oInput = oEvent.getSource();
            var sVal = oInput.getValue().replace(",", ".");
            if (isNaN(sVal) || sVal.trim() === "") {
                MessageToast.show("Por favor, inserir somente números!");
                oInput.setValue("");
                return;
            }
            var aIndices = oInput.getModel("dialog").getProperty(oInput.getBindingContext("dialog").getPath().split("/indices")[0] + "/indices") || oInput.getModel("dialog").getProperty("/globalIndices") || oInput.getModel("dialog").getProperty("/indicesCadastro");
            var fTotal = aIndices.reduce((acc, obj) => acc + (parseFloat(String(obj.peso).replace(",", ".")) || 0), 0);
            if (fTotal > 100) {
                MessageToast.show("O total de peso do índice tem que ser menor ou igual a 100%");
                oInput.setValue("");
            }
        },

        onDialogProximo: function () {
            var oModel = this._oView.byId("dialogParametricas").getModel("dialog");
            var iCurrent = oModel.getProperty("/currentIndex");
            oModel.setProperty("/currentIndex", iCurrent + 1);
            oModel.setProperty("/currentItem", oModel.getProperty("/selectedItems")[iCurrent + 1]);
        },

        onDialogVoltar: function () {
            var oModel = this._oView.byId("dialogParametricas").getModel("dialog");
            var iCurrent = oModel.getProperty("/currentIndex");
            oModel.setProperty("/currentIndex", iCurrent - 1);
            oModel.setProperty("/currentItem", oModel.getProperty("/selectedItems")[iCurrent - 1]);
        },

        onDialogCancel: function () {
            if (this._oView.byId("dialogParametricas")) this._oView.byId("dialogParametricas").close();
            if (this._oView.byId("dialogCadastroParametrica")) this._oView.byId("dialogCadastroParametrica").close();
        }
    });
});