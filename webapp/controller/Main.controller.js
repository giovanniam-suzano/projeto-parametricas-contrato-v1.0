sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (Controller, Fragment, MessageToast, JSONModel, Filter, FilterOperator) {
  "use strict";

  return Controller.extend("com.parametricas.parametricasapp.controller.Main", {

    /* =========================================================== */
    /* Lifecycle */
    /* =========================================================== */
    onInit: function () {
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
    },

    /* =========================================================== */
    /* Helper: buscar item por ID (explícito) */
    /* =========================================================== */
    _getContratoById: function (sId) {
      var oModel = this.getView().getModel();
      var aContratos = oModel.getProperty("/contratos") || [];
      return aContratos.find(function (oItem) {
        return String(oItem.id) === String(sId);
      }) || null;
    },

    /* =========================================================== */
    /* Helper: sincroniza currentItem com currentIndex */
    /* =========================================================== */
    _syncCurrentItem: function (oDialogModel) {
      var aItems = oDialogModel.getProperty("/selectedItems") || [];
      var iCurrent = oDialogModel.getProperty("/currentIndex") || 0;
      var oCurrent = aItems[iCurrent] || null;
      oDialogModel.setProperty("/currentItem", oCurrent);
    },

    /* =========================================================== */
    /* Table Actions */
    /* =========================================================== */
    onEditarPress: function () {
      var oTable = this.byId("tabelaContratos");
      var aItems = oTable.getSelectedItems();

      if (aItems.length === 0) {
        MessageToast.show("Selecione ao menos um item para editar");
        return;
      }

      var aContexts = aItems.map(function (oItem) {
        return oItem.getBindingContext();
      });

      this._abrirDialogParametricas(aContexts);
    },

    onSearch: function (oEvent) {
      var sQuery = (oEvent.getParameter("query") || "").trim();
      var oTable = this.byId("tabelaContratos");
      var oBinding = oTable.getBinding("items");

      if (!oBinding) return;

      if (!sQuery) {
        oBinding.filter([]);
        return;
      }

      var aOrFilters = [
        new Filter("id", FilterOperator.Contains, sQuery),
        new Filter("material", FilterOperator.Contains, sQuery)
      ];

      oBinding.filter([
        new Filter({ filters: aOrFilters, and: false })
      ]);
    },

    onConcluidoPress: function () {
      var oTable = this.byId("tabelaContratos");
      var aItems = oTable.getSelectedItems();

      if (aItems.length === 0) {
        MessageToast.show("Selecione ao menos um item para concluir");
        return;
      }

      MessageToast.show(aItems.length + " item(ns) marcado(s) como concluído(s)");
      oTable.removeSelections(true);
    },

    /* =========================================================== */
    /* Dialog */
    /* =========================================================== */
    _abrirDialogParametricas: function (aContexts) {
  var oView = this.getView();
  var oMainModel = oView.getModel();

  // Cálculo para o Cenário 1 (Comparar selecionados com o total da tabela)
  var iTotalTableItems = (oMainModel.getProperty("/contratos") || []).length;
  var iSelectedCount = aContexts.length;
  var bAllSelected = (iTotalTableItems > 0 && iSelectedCount === iTotalTableItems);

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
    var aSelectedItems = aContexts.map(function (oCtx, i) {
      var oObj = oCtx.getObject();
      return {
        seq: i + 1,
        id: oObj.id,
        material: oObj.material,
        quantidade: oObj.quantidade,
        unidade: oObj.unidade,
        valorUnitario: oObj.valorUnitario,
        valorTotal: oObj.valorTotal,
        valorSugerido: oObj.valorSugerido,
        indices: [{ ordem: 1, tipoIndice: "", peso: "", addMore: "NAO" }]
      };
    });

    var oDialogModel = new JSONModel({
      isAllSelected: bAllSelected,
      selectedCount: iSelectedCount,
      currentIndex: 0,
      currentItem: aSelectedItems[0] || null,
      selectedItems: aSelectedItems
    });

    oDialog.setModel(oDialogModel, "dialog");
    oDialog.open();
  }.bind(this));
},

    /* =========================================================== */
    /* Índices dinâmicos (por item selecionado) */
    /* =========================================================== */
    onAdicionarIndice: function (oEvent) {
      var oComboBox = oEvent.getSource();
      var sKey = oComboBox.getSelectedKey();

      var oDialog = this.byId("dialogParametricas");
      var oModel = oDialog.getModel("dialog");

      var oCtx = oComboBox.getBindingContext("dialog");
      if (!oCtx) return;

      var sPathIndice = oCtx.getPath();                 // /selectedItems/0/indices/0
      var sPathIndices = sPathIndice.substring(0, sPathIndice.lastIndexOf("/")); // /selectedItems/0/indices

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

    /* =========================================================== */
    /* Navegação: troca de formulário  */
    /* =========================================================== */
    onDialogProximo: function () {
      var oDialog = this.byId("dialogParametricas");
      var oModel = oDialog.getModel("dialog");

      var iCurrent = oModel.getProperty("/currentIndex") || 0;
      var iCount = (oModel.getProperty("/selectedItems") || []).length;

      if (iCurrent < iCount - 1) {
        oModel.setProperty("/currentIndex", iCurrent + 1);
        // ✅ garante que o header mostre só o item atual
        this._syncCurrentItem(oModel);
      } else {
        MessageToast.show("Você já está no último item selecionado");
      }
    },

    onDialogVoltar: function () {
      var oDialog = this.byId("dialogParametricas");
      var oModel = oDialog.getModel("dialog");

      var iCurrent = oModel.getProperty("/currentIndex") || 0;

      if (iCurrent > 0) {
        oModel.setProperty("/currentIndex", iCurrent - 1);
        // ✅ garante que o header mostre só o item atual
        this._syncCurrentItem(oModel);
      } else {
        MessageToast.show("Você já está no primeiro item selecionado");
      }
    },

    onDialogCancel: function () {
      this.byId("dialogParametricas").close();
    }

  });
});
