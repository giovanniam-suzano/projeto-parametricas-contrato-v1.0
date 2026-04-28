sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("com.parametricas.parametricasapp.controller.ParametricasDialog", {

        constructor: function (oView) {
            this._oView = oView;
        },

        _getDialog: function (sId) {
            return this._oView.byId(sId);
        },

        _syncCurrentItem: function (oModel) {
            var aItems = oModel.getProperty("/selectedItems") || [];
            var iCurrent = oModel.getProperty("/currentIndex") || 0;
            oModel.setProperty("/currentItem", aItems[iCurrent] || null);
        },

        onAdicionarIndice: function (oEvent) {
            var oComboBox = oEvent.getSource();
            var sKey = oComboBox.getSelectedKey();
            var oModel = oComboBox.getModel("dialog");
            var oCtx = oComboBox.getBindingContext("dialog");
            
            if (!oCtx) return;

            var sPathIndices = oCtx.getPath().substring(0, oCtx.getPath().lastIndexOf("/"));
            var aIndices = oModel.getProperty(sPathIndices) || [];
            var iIndexAtual = aIndices.indexOf(oCtx.getObject());

            if (sKey === "SIM") {
                if (iIndexAtual === aIndices.length - 1) {
                    aIndices.push({ ordem: aIndices.length + 1, tipoIndice: "", peso: "", addMore: "NAO" });
                }
            } else {
                aIndices.splice(iIndexAtual + 1);
            }

            oModel.setProperty(sPathIndices, aIndices);
            oModel.refresh(true); // FORÇA A ATUALIZAÇÃO VISUAL NA TELA
        },

        onAdicionarIndiceCadastro: function (oEvent) {
            var oComboBox = oEvent.getSource();
            var sKey = oComboBox.getSelectedKey();
            var oModel = oComboBox.getModel("dialog");
            var aIndices = oModel.getProperty("/indicesCadastro") || [];
            var iIndexAtual = aIndices.indexOf(oEvent.getSource().getBindingContext("dialog").getObject());

            if (sKey === "SIM") {
                if (iIndexAtual === aIndices.length - 1) {
                    aIndices.push({ ordem: aIndices.length + 1, valor: "", tipoIndice: "", peso: "", dataBaseParametrica: "", addMore: "NAO" });
                }
            } else {
                aIndices.splice(iIndexAtual + 1);
            }

            oModel.setProperty("/indicesCadastro", aIndices);
            oModel.refresh(true); // FORÇA A ATUALIZAÇÃO VISUAL NA TELA
        },

        onDialogProximo: function () {
            var oModel = this._getDialog("dialogParametricas").getModel("dialog");
            var iCurrent = oModel.getProperty("/currentIndex") || 0;
            var iCount = (oModel.getProperty("/selectedItems") || []).length;

            if (iCurrent < iCount - 1) {
                oModel.setProperty("/currentIndex", iCurrent + 1);
                this._syncCurrentItem(oModel);
            }
        },

        onDialogVoltar: function () {
            var oModel = this._getDialog("dialogParametricas").getModel("dialog");
            var iCurrent = oModel.getProperty("/currentIndex") || 0;

            if (iCurrent > 0) {
                oModel.setProperty("/currentIndex", iCurrent - 1);
                this._syncCurrentItem(oModel);
            }
        },

        onDialogCancel: function () {
            if (this._oView.byId("dialogParametricas")) this._oView.byId("dialogParametricas").close();
            if (this._oView.byId("dialogCadastroParametrica")) this._oView.byId("dialogCadastroParametrica").close();
        }
    });
});