sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    function(Controller, JSONModel){
        "use strict";
        return Controller.extend("frontend.controller.Detail", {
            onInit: function() {

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("detail").attachPatternMatched(this._oRouterMatched, this);
                // if(!this.getView().getModel("book")){
                //     var bookModel = this.getOwnerComponent().getModel("book");
                //     this.getView().setModel(bookModel, "book")
                // }

            },

            _getBookModel: function() {
                return this.getOwnerComponent().getModel("book");
            },



            _oRouterMatched:function(event){
                var indexPath = event.getParameter("arguments").indexPath;
                var bookModel = this._getBookModel();
                var bookDetail = bookModel.getData()[indexPath];
                this.getView().setModel(new JSONModel(bookDetail));
            }
        })
    }
)