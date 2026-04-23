sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "./ParametricasDialog.controller" // Importação do novo controlador
], function (Controller, Fragment, MessageToast, JSONModel, Filter, FilterOperator, ParametricasDialogController) {
    "use strict";

    return Controller.extend("com.parametricas.parametricasapp.controller.Main", {

        onInit: function () {
            // Mantém a inicialização do modelo principal
            var oMainModel = new JSONModel({
                contratos: [
                    {
            id: "1",
            material: "Parafuso",
            quantidade: 12,
            unidade: "UN",
            valorUnitario: "150,00",
            valorTotal: "1.800,00 REAL",
            valorSugerido: "1.750,00 REAL"
          },
          {
            id: "2",
            material: "Martelo",
            quantidade: 5,
            unidade: "UN",
            valorUnitario: "247,00",
            valorTotal: "1.235,00 REAL",
            valorSugerido: "1.200,00 REAL"
          },
          {
            id: "3",
            material: "Chave de Fenda",
            quantidade: 8,
            unidade: "UN",
            valorUnitario: "85,00",
            valorTotal: "680,00 REAL",
            valorSugerido: "650,00 REAL"
          },
          {
            id: "4",
            material: "Chave Philips",
            quantidade: 10,
            unidade: "UN",
            valorUnitario: "92,00",
            valorTotal: "920,00 REAL",
            valorSugerido: "900,00 REAL"
          },
          {
            id: "5",
            material: "Alicate",
            quantidade: 6,
            unidade: "UN",
            valorUnitario: "180,00",
            valorTotal: "1.080,00 REAL",
            valorSugerido: "1.050,00 REAL"
          },
          {
            id: "6",
            material: "Trena",
            quantidade: 4,
            unidade: "UN",
            valorUnitario: "210,00",
            valorTotal: "840,00 REAL",
            valorSugerido: "820,00 REAL"
          },
          {
            id: "7",
            material: "Serrote",
            quantidade: 3,
            unidade: "UN",
            valorUnitario: "320,00",
            valorTotal: "960,00 REAL",
            valorSugerido: "930,00 REAL"
          },
          {
            id: "8",
            material: "Furadeira",
            quantidade: 2,
            unidade: "UN",
            valorUnitario: "1.250,00",
            valorTotal: "2.500,00 REAL",
            valorSugerido: "2.450,00 REAL"
          },
          {
            id: "9",
            material: "Lixadeira",
            quantidade: 2,
            unidade: "UN",
            valorUnitario: "980,00",
            valorTotal: "1.960,00 REAL",
            valorSugerido: "1.900,00 REAL"
          },
          {
            id: "10",
            material: "Disco de Corte",
            quantidade: 15,
            unidade: "UN",
            valorUnitario: "45,00",
            valorTotal: "675,00 REAL",
            valorSugerido: "650,00 REAL"
          },
          {
            id: "11",
            material: "Broca",
            quantidade: 20,
            unidade: "UN",
            valorUnitario: "38,00",
            valorTotal: "760,00 REAL",
            valorSugerido: "720,00 REAL"
          },
          {
            id: "12",
            material: "Luvas de Proteção",
            quantidade: 12,
            unidade: "UN",
            valorUnitario: "55,00",
            valorTotal: "660,00 REAL",
            valorSugerido: "630,00 REAL"
          },
          {
            id: "13",
            material: "Óculos de Segurança",
            quantidade: 10,
            unidade: "UN",
            valorUnitario: "70,00",
            valorTotal: "700,00 REAL",
            valorSugerido: "680,00 REAL"
          },
          {
            id: "14",
            material: "Capacete de Segurança",
            quantidade: 5,
            unidade: "UN",
            valorUnitario: "160,00",
            valorTotal: "800,00 REAL",
            valorSugerido: "780,00 REAL"
          }
                ]
            });
            this.getView().setModel(oMainModel);

            // Instancia o controlador do diálogo passando a view atual
            this._oDialogController = new ParametricasDialogController(this.getView());
        },

        onEditarPress: function () {
            var aItems = this.byId("tabelaContratos").getSelectedItems();
            if (aItems.length === 0) {
                MessageToast.show("Selecione ao menos um item");
                return;
            }
            this._abrirDialogParametricas(aItems.map(o => o.getBindingContext()));
        },

        onSearch: function (oEvent) {
            var sQuery = (oEvent.getParameter("query") || "").trim();
            var oBinding = this.byId("tabelaContratos").getBinding("items");
            if (!oBinding) return;

            var aFilters = sQuery ? [new Filter("material", FilterOperator.Contains, sQuery)] : [];
            oBinding.filter(aFilters);
        },

        _abrirDialogParametricas: function (aContexts) {
            var oView = this.getView();
            var iSelectedCount = aContexts.length;
            var iTotalTableItems = (oView.getModel().getProperty("/contratos") || []).length;

            if (!this._pParametricasDialog) {
                this._pParametricasDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.parametricas.parametricasapp.view.ParametricasDialog",
                    controller: this._oDialogController // Vincula ao novo controlador
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pParametricasDialog.then(function (oDialog) {
                var aItems = aContexts.map((oCtx, i) => ({
                    ...oCtx.getObject(),
                    seq: i + 1,
                    indices: [{ ordem: 1, tipoIndice: "", peso: "", addMore: "NAO" }]
                }));

                oDialog.setModel(new JSONModel({
                    isAllSelected: (iSelectedCount === iTotalTableItems),
                    selectedCount: iSelectedCount,
                    currentIndex: 0,
                    currentItem: aItems[0],
                    selectedItems: aItems
                }), "dialog");

                oDialog.open();
            });
        }
    });
});