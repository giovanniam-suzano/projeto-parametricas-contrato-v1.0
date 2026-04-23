sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.parametricas.parametricasapp.controller.ParametricasDialog", {

        /**
         * Inicializa o controlador do diálogo vinculando o diálogo a ele
         */
        constructor: function (oView) {
            this._oView = oView;
        },

        /* =========================================================== */
        /* Helpers Internos */
        /* =========================================================== */
        _getDialog: function () {
            return this._oView.byId("dialogParametricas");
        },

        _syncCurrentItem: function (oModel) {
            var aItems = oModel.getProperty("/selectedItems") || [];
            var iCurrent = oModel.getProperty("/currentIndex") || 0;
            var oCurrent = aItems[iCurrent] || null;
            oModel.setProperty("/currentItem", oCurrent);
        },

        /* =========================================================== */
        /* Eventos do Fragmento */
        /* =========================================================== */
        onAdicionarIndice: function (oEvent) {
            var oComboBox = oEvent.getSource();
            var sKey = oComboBox.getSelectedKey();
            var oModel = this._getDialog().getModel("dialog");
            var oCtx = oComboBox.getBindingContext("dialog");

            if (!oCtx) return;

            var sPathIndice = oCtx.getPath();
            var sPathIndices = sPathIndice.substring(0, sPathIndice.lastIndexOf("/"));
            var aIndices = oModel.getProperty(sPathIndices) || [];
            var oIndiceAtual = oCtx.getObject();
            var iIndexAtual = aIndices.indexOf(oIndiceAtual);

            if (sKey === "SIM") {
                if (iIndexAtual === aIndices.length - 1) {
                    aIndices.push({
                        ordem: aIndices.length + 1,
                        tipoIndice: "",
                        peso: "",
                        addMore: "NAO"
                    });
                }
            } else {
                aIndices.splice(iIndexAtual + 1);
            }
            oModel.setProperty(sPathIndices, aIndices);
        },

        onDialogProximo: function () {
            var oModel = this._getDialog().getModel("dialog");
            var iCurrent = oModel.getProperty("/currentIndex") || 0;
            var iCount = (oModel.getProperty("/selectedItems") || []).length;

            if (iCurrent < iCount - 1) {
                oModel.setProperty("/currentIndex", iCurrent + 1);
                this._syncCurrentItem(oModel);
            }
        },

        onDialogVoltar: function () {
            var oModel = this._getDialog().getModel("dialog");
            var iCurrent = oModel.getProperty("/currentIndex") || 0;

            if (iCurrent > 0) {
                oModel.setProperty("/currentIndex", iCurrent - 1);
                this._syncCurrentItem(oModel);
            }
        },

        onDialogCancel: function () {
            this._getDialog().close();
        }
    });
});