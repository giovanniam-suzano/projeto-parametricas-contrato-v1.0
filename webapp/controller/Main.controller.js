sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
], function (Controller, Fragment, MessageToast) {
    "use strict";

    return Controller.extend("com.parametricas.parametricasapp.controller.Main", {
        onInit: function () {
    var oModel = new sap.ui.model.json.JSONModel({
        contratos: [
            {
                id: "1",
                material: "Parafuso",
                quantidade: 12,
                unidade: 10,
                valorUnitario: "15,00",
                valorTotal: "1.800,00 REAL",
                valorSugerido: "1.875,00 REAL"
            },
            {
                id: "2",
                material: "Martelo",
                quantidade: 5,
                unidade: 1,
                valorUnitario: "247,00",
                valorTotal: "1.235,00 REAL",
                valorSugerido: "1.345,00 REAL"
            }
        ]
    });

    this.getView().setModel(oModel);
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
            var oTable = this.byId("tabelaContratos");
            var aItems = oTable.getSelectedItems();

            if (aItems.length === 0) {
                MessageToast.show("Selecione um item para editar");
                return;
            }

            if (aItems.length > 1) {
                MessageToast.show("Selecione apenas um item para editar");
                return;
            }

            var oSelectedItem = aItems[0];
            var oContext = oSelectedItem.getBindingContext();

            this.onAbrirParametricas(oContext);
        },

        onConcluidoPress: function () {
            MessageToast.show("Ação de Concluído disparada.");
        },

        /* =========================================================== */
        /* Gerenciamento do Fragment / Modal de Paramétricas           */
        /* =========================================================== */

        onAbrirParametricas: function (oContext) {
            var oView = this.getView();

            if (!this._pParametricasDialog) {
                this._pParametricasDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.parametricas.parametricasapp.view.ParametricasDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pParametricasDialog.then(function (oDialog) {
                oDialog.setBindingContext(oContext); 
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