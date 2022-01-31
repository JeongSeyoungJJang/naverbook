sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, JSONModel) {
		"use strict";

		return Controller.extend("frontend.controller.Overview", {
			onInit: function () {
				if(!this.getView().getModel("book")){
                    var bookModel = this.getOwnerComponent().getModel("book");
                    this.getView().setModel(bookModel, "book")
                }
			},


			_getView: function() {
				return this.getView();
			},




			handleItemPress: function(event) {
                var bindingPath = event.getSource().getBindingContextPath().split("/").reverse()[0];

				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("detail",{
                    indexPath: bindingPath
                })
			}
		});
	});
