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
				this._getBookData();
			},


			_getView: function() {
				return this.getView();
			},


			_getBookData: function() {
                var that = this;
				var view = this._getView();
				return $.ajax({
					url: "http://localhost:3001/book",
					success: function(res) {
						that.getOwnerComponent().setModel(new JSONModel(res.value),"book")
					},
					error: function(err) {
						console.log(err)
					}
				})
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
