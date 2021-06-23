sap.ui.define([
	"vd/com/ListOfBooks/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("vd.com.ListOfBooks.controller.App", {

		onInit: function () {

			var oJsonModel = new JSONModel({
				screen: "sap-icon://full-screen",
				fullScreen: true
			});

			this.getOwnerComponent().setModel(oJsonModel, "mainView");
		}

	});
});