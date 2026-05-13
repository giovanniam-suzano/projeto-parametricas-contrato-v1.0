sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox", // Adicionado para o aviso de exclusão
    "sap/ui/model/json/JSONModel",
    "./EditarDialog.controller",
    "./CadastroDialog.controller"
], function (Controller, Fragment, MessageToast, MessageBox, JSONModel, EditarDialogController, CadastroDialogController) {
    "use strict";

    return Controller.extend("com.parametricas.parametricasapp.controller.Main", {

        onInit: function () {
            // Mantendo bases de exemplo conforme solicitado
            this._allContratosMock = [
                {
                    ncontrato: "212354",
                    dataBaseParametrica: "12/02/2025",
                    periodo: "mensal",
                    dataBaseReajuste: "01/06/2026",
                    items: [
                        { id: "1", material: "Cabo de Rede CAT6", ncontrato: "212354", ni: "21.235.401-1", unidade: "M", valorUnitario: "7,20", reajusteTotal: "6.23%" },
                        { id: "2", material: "Patch Panel 24P", ncontrato: "212354", ni: "21.235.401-2", unidade: "UN", valorUnitario: "280,00", reajusteTotal: "9.20%" },
                        { id: "3", material: "Rack de Piso 40U", ncontrato: "212354", ni: "21.235.401-3", unidade: "UN", valorUnitario: "2.950,00", reajusteTotal: "6,24%" },
                        { id: "4", material: "Switch Gerenciável 48P", ncontrato: "212354", ni: "21.235.401-4", unidade: "UN", valorUnitario: "3.200,00", reajusteTotal: "4,40%" },
                        { id: "5", material: "Organizador de Cabos", ncontrato: "212354", ni: "21.235.401-5", unidade: "UN", valorUnitario: "65,00", reajusteTotal: "5.00%" },
                        { id: "6", material: "Nobreak 3000VA", ncontrato: "212354", ni: "21.235.401-6", unidade: "UN", valorUnitario: "4.400,00", reajusteTotal: "17,34%" }
                    ]
                }
                // ... demais mocks mantidos internamente
            ];

            this.getView().setModel(new JSONModel({
                contratos: [],
                headerVisible: false,
                headerData: {}
            }));

            this._oEditarDialogController = new EditarDialogController(this.getView());
            this._oCadastroDialogController = new CadastroDialogController(this.getView());
        },

        onExcluirParametricasPress: function () {
            MessageBox.confirm("Você tem certeza que deseja excluir todas as Paramétricas desse contrato?", {
                title: "Confirmação de Exclusão",
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.NO,
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.YES) {
                        MessageToast.show("Paramétricas excluídas com sucesso.");
                        // Lógica de exclusão seria implementada aqui
                    }
                }
            });
        },

        // ... demais funções onSearch, onEditarPress mantidas conforme original
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query") || oEvent.getSource().getValue();
            var oModel = this.getView().getModel();
            if (!sQuery) {
                oModel.setProperty("/contratos", []);
                oModel.setProperty("/headerVisible", false);
                return;
            }
            var oContrato = this._allContratosMock.find(item => item.ncontrato === sQuery);
            if (oContrato) {
                oModel.setProperty("/contratos", oContrato.items);
                oModel.setProperty("/headerData", {
                    dataBaseParametrica: oContrato.dataBaseParametrica,
                    periodo: oContrato.periodo
                });
                oModel.setProperty("/headerVisible", true);
            } else {
                MessageToast.show("Contrato " + sQuery + " não localizado.");
                oModel.setProperty("/contratos", []);
                oModel.setProperty("/headerVisible", false);
            }
        },

        onEditarPress: function () {
            var aItems = this.byId("tabelaContratos").getSelectedItems();
            if (aItems.length === 0) {
                MessageToast.show("Selecione ao menos um item");
                return;
            }
            this._abrirDialogEditar(aItems.map(o => o.getBindingContext()));
        },

        onCadastroParametricaPress: function () {
            var oView = this.getView();
            var aSelectedItems = this.byId("tabelaContratos").getSelectedItems();
            var iTotalTabela = oView.getModel().getProperty("/contratos").length;
            if (aSelectedItems.length === 0) {
                MessageToast.show("Selecione ao menos um item.");
                return;
            }
            if (!this._pCadastroDialog) {
                this._pCadastroDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.parametricas.parametricasapp.view.CadastroDialog",
                    controller: this._oCadastroDialogController
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this._pCadastroDialog.then(function (oDialog) {
                var aItems = aSelectedItems.map(function (o, i) {
                    return Object.assign({}, o.getBindingContext().getObject(), {
                        seq: i + 1,
                        indices: [{ ordem: 1, tipoIndice: "", peso: "", reajusteProjetado: "", addMore: "NAO" }]
                    });
                });
                oDialog.setModel(new JSONModel({
                    isAllSelected: (aItems.length === iTotalTabela),
                    selectedCount: aItems.length,
                    currentIndex: 0,
                    currentItem: aItems[0],
                    selectedItems: aItems,
                    globalIndices: [{ ordem: 1, tipoIndice: "", peso: "", reajusteProjetado: "", addMore: "NAO" }]
                }), "dialog");
                oDialog.open();
            });
        },

        _abrirDialogEditar: function (aContexts) {
            var oView = this.getView();
            if (!this._pEditarDialog) {
                this._pEditarDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.parametricas.parametricasapp.view.EditarDialog",
                    controller: this._oEditarDialogController
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this._pEditarDialog.then(function (oDialog) {
                var iTotalItens = oView.getModel().getProperty("/contratos").length;
                var aItems = aContexts.map(function (oCtx, i) {
                    return Object.assign({}, oCtx.getObject(), {
                        seq: i + 1,
                        indices: [{ ordem: 1, tipoIndice: "IPCA", peso: "100", reajusteProjetado: "0.5", addMore: "NAO" }]
                    });
                });
                oDialog.setModel(new JSONModel({
                    isAllSelected: (aItems.length === iTotalItens),
                    selectedCount: aItems.length,
                    currentIndex: 0,
                    currentItem: aItems[0],
                    selectedItems: aItems,
                    isNegociando: false,
                    alterarReajusteTotal: false, // Novo estado para v3.1
                    globalIndices: [{ ordem: 1, tipoIndice: "IPCA", peso: "100", reajusteProjetado: "0.5", addMore: "NAO" }]
                }), "dialog");
                oDialog.open();
            });
        },

        onConcluidoPress: function () {
            MessageToast.show("Processo concluído com sucesso!");
        }
    });
});