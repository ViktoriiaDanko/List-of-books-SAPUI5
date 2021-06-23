sap.ui.define([
	"vd/com/ListOfBooks/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"vd/com/ListOfBooks/model/formatter",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, formatter, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("vd.com.ListOfBooks.controller.Books", {
		formatter: formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf vd.com.ListOfBooks.view.Books
		 */
		onInit: function () {
			this.getRouter().getRoute("Books").attachPatternMatched(this._onObjectMatched, this);

			var oModelJSON = new JSONModel();
			this.getView().setModel(oModelJSON, "oJsonModelBooks");
			this.getModel("oJsonModelBooks").setProperty("/Books", []);
			this.getModel("oJsonModelBooks").setProperty("/Authors", []);
		},

		_onObjectMatched: function (oEvent) {
			this._getAuthorsInfo();
			this._getBooksInfo();
		},

		_getAuthorsInfo: async function () {
			try {
				var response = await fetch('https://fakerestapi.azurewebsites.net/api/v1/Authors');
				var oListOfAuthors = await response.json();

				this.getModel("oJsonModelBooks").setProperty("/Authors", oListOfAuthors);
			} catch (err) {
				MessageBox.error(err.message);
			}
		},

		_getBooksInfo: async function () {
			try {
				var response = await fetch('https://fakerestapi.azurewebsites.net/api/v1/Books');
				var listOfBooks = await response.json();

				this.getModel("oJsonModelBooks").setProperty("/Books", listOfBooks);
			} catch (err) {
				MessageBox.error(err.message);
			}
		},

		onSearchBook: async function (oEvent) {
			this.byId('id-Filter-Books').setValue('');
			var oJsonModelAuthors = this.getModel("oJsonModelBooks").getProperty("/Authors");
			var sSelectedItem = Number(oEvent.getSource().getSelectedItem().getKey());

			try {
				var response = await fetch('https://fakerestapi.azurewebsites.net/api/v1/Books');
				var listOfBooks = await response.json();

				var result = listOfBooks.filter(function (v) {
					return oJsonModelAuthors.some(function (v2) {
						return v.id === sSelectedItem;
					});
				})
				this.getModel("oJsonModelBooks").setProperty("/Books", result);
			} catch (err) {
				MessageBox.error(err.message);
			}
		},

		onClear: function () {
			this._getBooksInfo();
			this.byId('id-Filter-Author').setValue('');
			this.byId('id-Filter-Books').setValue('');
		},

		onFullScreen: function () {
			var oMainModel = this.getOwnerComponent().getModel("mainView");
			var flag = oMainModel.getProperty("/fullScreen");
			if (flag) {
				oMainModel.setProperty("/screen", "sap-icon://exit-full-screen");
				oMainModel.setProperty("/fullScreen", false);
			} else {
				oMainModel.setProperty("/screen", "sap-icon://full-screen");
				oMainModel.setProperty("/fullScreen", true);
			}
		},

		onChange: function (oEvent) {
			var sValue = oEvent.getParameter('value');
			MessageToast.show(sValue);
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf vd.com.ListOfBooks.view.Books
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf vd.com.ListOfBooks.view.Books
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf vd.com.ListOfBooks.view.Books
		 */
		//	onExit: function() {
		//
		//	}

	});

});