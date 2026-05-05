sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "./EditarDialog.controller",
    "./CadastroDialog.controller"
], function (Controller, Fragment, MessageToast, JSONModel, EditarDialogController, CadastroDialogController) {
    "use strict";

    return Controller.extend("com.parametricas.parametricasapp.controller.Main", {

        onInit: function () {
            this._allContratosMock = [
                {
                    ncontrato: "212354",
                    dataBaseParametrica: "12/02/2025",
                    periodo: "mensal",
                    dataBaseReajuste: "01/06/2026",
                    items: [
                        { id: "1", material: "Cabo de Rede CAT6", ncontrato: "212354", ni: "21.235.401-1", quantidade: 150, unidade: "M", valorUnitario: "7,20", valorTotal: "1.080,00 REAL", valorSugerido: "1.180,00 REAL" },
                        { id: "2", material: "Patch Panel 24P", ncontrato: "212354", ni: "21.235.401-2", quantidade: 6, unidade: "UN", valorUnitario: "280,00", valorTotal: "1.680,00 REAL", valorSugerido: "1.850,00 REAL" },
                        { id: "3", material: "Rack de Piso 40U", ncontrato: "212354", ni: "21.235.401-3", quantidade: 2, unidade: "UN", valorUnitario: "2.950,00", valorTotal: "5.900,00 REAL", valorSugerido: "6.350,00 REAL" },
                        { id: "4", material: "Switch Gerenciável 48P", ncontrato: "212354", ni: "21.235.401-4", quantidade: 3, unidade: "UN", valorUnitario: "3.200,00", valorTotal: "9.600,00 REAL", valorSugerido: "10.300,00 REAL" },
                        { id: "5", material: "Organizador de Cabos", ncontrato: "212354", ni: "21.235.401-5", quantidade: 12, unidade: "UN", valorUnitario: "65,00", valorTotal: "780,00 REAL", valorSugerido: "850,00 REAL" },
                        { id: "6", material: "Nobreak 3000VA", ncontrato: "212354", ni: "21.235.401-6", quantidade: 2, unidade: "UN", valorUnitario: "4.400,00", valorTotal: "8.800,00 REAL", valorSugerido: "9.500,00 REAL" }
                    ]
                },
                {
                    ncontrato: "212355",
                    dataBaseParametrica: "20/03/2025",
                    periodo: "anual",
                    dataBaseReajuste: "15/08/2027",
                    items: [
                        { id: "1", material: "Sensor de Temperatura Industrial", ncontrato: "212355", ni: "21.235.502-1", quantidade: 10, unidade: "UN", valorUnitario: "520,00", valorTotal: "5.200,00 REAL", valorSugerido: "5.650,00 REAL" },
                        { id: "2", material: "Controlador Lógico Programável (CLP)", ncontrato: "212355", ni: "21.235.502-2", quantidade: 4, unidade: "UN", valorUnitario: "6.800,00", valorTotal: "27.200,00 REAL", valorSugerido: "29.000,00 REAL" },
                        { id: "3", material: "Módulo de Expansão Digital", ncontrato: "212355", ni: "21.235.502-3", quantidade: 6, unidade: "UN", valorUnitario: "1.250,00", valorTotal: "7.500,00 REAL", valorSugerido: "8.100,00 REAL" },
                        { id: "4", material: "Fonte Chaveada Industrial", ncontrato: "212355", ni: "21.235.502-4", quantidade: 5, unidade: "UN", valorUnitario: "890,00", valorTotal: "4.450,00 REAL", valorSugerido: "4.850,00 REAL" },
                        { id: "5", material: "Terminal de Operação (IHM)", ncontrato: "212355", ni: "21.235.502-5", quantidade: 3, unidade: "UN", valorUnitario: "3.600,00", valorTotal: "10.800,00 REAL", valorSugerido: "11.700,00 REAL" },
                        { id: "6", material: "Cabo de Instrumentação", ncontrato: "212355", ni: "21.235.502-6", quantidade: 250, unidade: "M", valorUnitario: "8,40", valorTotal: "2.100,00 REAL", valorSugerido: "2.300,00 REAL" }
                    ]
                }
            ];

            this.getView().setModel(new JSONModel({
                contratos: [],
                headerVisible: false,
                headerData: {}
            }));

            this._oEditarDialogController = new EditarDialogController(this.getView());
            this._oCadastroDialogController = new CadastroDialogController(this.getView());
        },

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
                    periodo: oContrato.periodo,
                    dataBaseReajuste: oContrato.dataBaseReajuste
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
                        // Unificando para 'indices' em todos os itens individuais[cite: 3]
                        indices: [{ ordem: 1, tipoIndice: "", valorIndice: "", peso: "", addMore: "NAO" }]
                    });
                });
                oDialog.setModel(new JSONModel({
                    isAllSelected: (aItems.length === iTotalTabela),
                    selectedCount: aItems.length,
                    currentIndex: 0,
                    currentItem: aItems[0],
                    selectedItems: aItems,
                    globalIndices: [{ ordem: 1, tipoIndice: "", valorIndice: "", peso: "", addMore: "NAO" }]
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
                        indices: [{ ordem: 1, tipoIndice: "IPCA", valorIndice: "1.25", variacao: "0.5", novoValor: "1.75", peso: "100", addMore: "NAO" }]
                    });
                });
                oDialog.setModel(new JSONModel({
                    isAllSelected: (aItems.length === iTotalItens),
                    selectedCount: aItems.length,
                    currentIndex: 0,
                    currentItem: aItems[0],
                    selectedItems: aItems,
                    isNegociando: false,
                    globalIndices: [{ ordem: 1, tipoIndice: "IPCA", valorIndice: "1.25", variacao: "0.5", novoValor: "1.75", peso: "100", addMore: "NAO" }]
                }), "dialog");
                oDialog.open();
            });
        }
    });
});