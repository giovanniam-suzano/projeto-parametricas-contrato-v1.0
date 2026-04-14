sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
], function (Controller, Fragment, MessageToast) {
    "use strict";

    return Controller.extend("parametricas.app.controller.Main", {
        onInit: function () {
            // Inicializações se necessárias (Models, Routings)
        },

        /* =========================================================== */
        /* Ações da Tabela / Header                                    */
        /* =========================================================== */

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            // Lógica de filtro na lista (binding)
            MessageToast.show("Buscando por: " + sQuery);
        },

        onEditarPress: function () {
            MessageToast.show("Ação de Editar disparada.");
        },

        onConcluidoPress: function () {
            MessageToast.show("Ação de Concluído disparada.");
        },

        /* =========================================================== */
        /* Gerenciamento do Fragment / Modal de Paramétricas           */
        /* =========================================================== */

        onAbrirParametricas: function () {
            var oView = this.getView();

            // Padrão SAPUI5 para lazy loading de Fragments
            if (!this._pParametricasDialog) {
                this._pParametricasDialog = Fragment.load({
                    id: oView.getId(),
                    name: "parametricas.app.view.fragments.ParametricasDialog", // Ajuste para o seu namespace
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pParametricasDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        onDialogCancel: function () {
            if (this._pParametricasDialog) {
                this._pParametricasDialog.then(function(oDialog) {
                    oDialog.close();
                });
            }
        },

        onDialogProximo: function () {
            // Avança para o próximo step do Wizard manualmente se necessário
            var oWizard = this.byId("wizardParametricas");
            oWizard.nextStep();
        },

        onDialogVoltar: function () {
            // Volta para o step anterior do Wizard manualmente
            var oWizard = this.byId("wizardParametricas");
            oWizard.previousStep();
        }

    });
});