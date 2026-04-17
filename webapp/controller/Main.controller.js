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
      // Model principal (simulando database)
      // ✅ Ajustado para conter os campos que a tabela espera
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
          }
        ]
      });

      this.getView().setModel(oMainModel);
    },

    /* =========================================================== */
    /* Informação complementar: buscar item por ID (explícito) */
    /* =========================================================== */
    _getContratoById: function (sId) {
      var oModel = this.getView().getModel();
      var aContratos = oModel.getProperty("/contratos") || [];
      return aContratos.find(function (oItem) {
        return String(oItem.id) === String(sId);
      }) || null;
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

      // ✅ Agora permite 1 ou N seleções
      var aContexts = aItems.map(function (oItem) {
        return oItem.getBindingContext();
      });

      this._abrirDialogParametricas(aContexts);
    },

    // ✅ Implementado: SearchField chama esse handler na View
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

    // ✅ Implementado: botão “Concluído”
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

      // Total de itens da tabela (para identificar quando "todos" foram selecionados)
      var iTotal = (oMainModel.getProperty("/contratos") || []).length;
      var iSelected = aContexts.length;
      var bAllSelected = (iTotal > 0 && iSelected === iTotal);

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

        // ✅ Monta os itens selecionados (cada um com seu próprio indices)
        var aSelectedItems = aContexts.map(function (oCtx, i) {
          var oObj = oCtx.getObject(); // já contém id/material/quantidade...
          return {
            seq: i + 1,                 // 1..N para o header ("Item 1", "Item 2"...)
            id: oObj.id,
            material: oObj.material,
            quantidade: oObj.quantidade,
            unidade: oObj.unidade,
            valorUnitario: oObj.valorUnitario,
            valorTotal: oObj.valorTotal,
            valorSugerido: oObj.valorSugerido,

            // indices por item
            indices: [
              { ordem: 1, tipoIndice: "", peso: "", addMore: "NAO" }
            ]
          };
        });

        var oDialogModel = new JSONModel({
          headerTitle: bAllSelected ? "Cabeçalho" : "", // usado no modo "todos selecionados"
          isAllSelected: bAllSelected,
          selectedCount: iSelected,

          // navegação entre formulários
          currentIndex: 0,

          // lista dos itens selecionados
          selectedItems: aSelectedItems
        });

        oDialog.setModel(oDialogModel, "dialog");
        oDialog.open();
      });
    },

    /* =========================================================== */
    /* Índices dinâmicos (por item selecionado) */
    /* =========================================================== */
    onAdicionarIndice: function (oEvent) {
      var oComboBox = oEvent.getSource();
      var sKey = oComboBox.getSelectedKey();

      var oDialog = this.byId("dialogParametricas");
      var oModel = oDialog.getModel("dialog");

      // Contexto aponta para um índice dentro de /selectedItems/{i}/indices/{j}
      var oCtx = oComboBox.getBindingContext("dialog");
      if (!oCtx) return;

      var sPathIndice = oCtx.getPath(); // ex: /selectedItems/0/indices/0
      var sPathIndices = sPathIndice.substring(0, sPathIndice.lastIndexOf("/")); // /selectedItems/0/indices
      var sPathItem = sPathIndices.substring(0, sPathIndices.lastIndexOf("/indices")); // /selectedItems/0

      var aIndices = oModel.getProperty(sPathIndices) || [];
      var oIndiceAtual = oCtx.getObject();
      var iIndexAtual = aIndices.indexOf(oIndiceAtual);

      if (sKey === "SIM") {
        // só adiciona se for o último índice desse item
        if (iIndexAtual === aIndices.length - 1) {
          aIndices.push({
            ordem: aIndices.length + 1,
            tipoIndice: "",
            peso: "",
            addMore: "NAO"
          });
        }
      } else {
        // remove todos os próximos
        aIndices.splice(iIndexAtual + 1);
      }

      oModel.setProperty(sPathIndices, aIndices);

      // (opcional) garante que o selectedCount e header continuam coerentes
      var aItems = oModel.getProperty("/selectedItems") || [];
      oModel.setProperty("/selectedCount", aItems.length);
      oModel.setProperty("/isAllSelected", oModel.getProperty("/isAllSelected") === true);
      oModel.setProperty("/headerTitle", oModel.getProperty("/isAllSelected") ? "Cabeçalho" : "");
    },

    /* =========================================================== */
    /* PASSO 2: Navegação entre formulários (um some, outro aparece) */
    /* =========================================================== */
    onDialogProximo: function () {
      var oDialog = this.byId("dialogParametricas");
      var oModel = oDialog.getModel("dialog");

      var iCurrent = oModel.getProperty("/currentIndex") || 0;
      var iCount = (oModel.getProperty("/selectedItems") || []).length;

      if (iCurrent < iCount - 1) {
        oModel.setProperty("/currentIndex", iCurrent + 1);
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
      } else {
        MessageToast.show("Você já está no primeiro item selecionado");
      }
    },

    onDialogCancel: function () {
      this.byId("dialogParametricas").close();
    }

  });
});
