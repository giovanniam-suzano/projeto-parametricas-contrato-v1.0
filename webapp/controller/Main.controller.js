sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, Fragment, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.parametricas.parametricasapp.controller.Main", {

        /* =========================================================== */
        /* Lifecycle */
        /* =========================================================== */
        onInit: function () {
            // Model principal (simulando database)
            var oMainModel = new JSONModel({
                contratos: [
                    {
                        id: "1",
                        material: "Parafuso",
                        quantidade: 12,
                        valorTotal: "1.800,00 REAL"
                    },
                    {
                        id: "2",
                        material: "Martelo",
                        quantidade: 5,
                        valorTotal: "1.235,00 REAL"
                    }
                ]
            });

            this.getView().setModel(oMainModel);
        },

        /* =========================================================== */
        /* Table Actions */
        /* =========================================================== */
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

            var oContext = aItems[0].getBindingContext();
            this._abrirDialogParametricas(oContext);
        },

        /* =========================================================== */
        /* Dialog */
        /* =========================================================== */
        _abrirDialogParametricas: function (oContext) {
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

                /* ===================================================== */
                /* ✅ AQUI É O PASSO 2 (LOCAL CORRETO)                   */
                /* ===================================================== */
                var oDialogModel = new JSONModel({
                    indices: [
                        { ordem: 1 }
                    ]
                });

                // Model responsável pelo form dinâmico
                oDialog.setModel(oDialogModel, "dialog");

                // Contexto do item selecionado
                oDialog.setBindingContext(oContext);

                oDialog.open();
            });
        },

        /* =========================================================== */
        /* Índices dinâmicos */
        /* =========================================================== */
       onAdicionarIndice: function (oEvent) {
            var oComboBox = oEvent.getSource();
            var sKey = oComboBox.getSelectedKey();

            var oDialog = this.byId("dialogParametricas");
            var oModel = oDialog.getModel("dialog");
            var aIndices = oModel.getProperty("/indices");

            // Descobre QUAL índice disparou o evento
            var oContext = oComboBox.getBindingContext("dialog");
            var iIndexAtual = aIndices.indexOf(oContext.getObject());

            if (sKey === "SIM") {
                // ✅ Se for o último, cria o próximo
                if (iIndexAtual === aIndices.length - 1) {
                    aIndices.push({
                        ordem: aIndices.length + 1
                    });
                }
            } else {
                // ✅ Se for NÃO, remove todos os próximos
                aIndices.splice(iIndexAtual + 1);
            }

            oModel.setProperty("/indices", aIndices);
        },

        /* =========================================================== */
        /* Wizard Navigation */
        /* =========================================================== */
        onDialogProximo: function () {
            this.byId("wizardParametricas").nextStep();
        },

        onDialogVoltar: function () {
            this.byId("wizardParametricas").previousStep();
        },

        onDialogCancel: function () {
            this.byId("dialogParametricas").close();
        }

    });
});
