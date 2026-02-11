sap.ui.define(
  [
    "sap/ui/core/mvc/ControllerExtension",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
  ],
  function (ControllerExtension, JSONModel, MessageToast) {
    "use strict";

    return ControllerExtension.extend(
      "br.com.descomplicando.swiki.ext.controller.ObjectPageExt",
      {
        // this section allows to extend lifecycle hooks or hooks provided by Fiori elements
        _onContextChanged: function () {
          // Busca o contexto atual da view
          var oContext = this.getView().getBindingContext();
          if (!oContext) return;

          // Busca o modelo da edção
          var oViewModel = this.getView().getModel("editorModel");
          if (!oViewModel) return;

          // Busca o componente de rich text editor
          var oEditor = this.byId("RTEDocumentacao");
          if (!oEditor) {
            var controls = this.getView().findAggregatedObjects(
              true,
              (control) => {
                return (
                  control.getId &&
                  control.getId().indexOf("RTEDocumentacao") > 1
                );
              },
            );

            if (controls.length > 0) oEditor = controls[0];
          }

          // Se achou, reconecta o evento de Change manualmente
         if (oEditor) {
           oEditor.detachChange(this._onEditorChange, this);
           oEditor.attachChange(this._onEditorChange, this);
         }


         // Muda ocupação para verdadeiro
         oViewModel.setProperty("/busy", true);

          // Buscare o documento e o Status da Entidade (Ativo ou Draft)
          Promise.all([
            oContext.requestProperty("Document"), // Supondo que 'Documentacao' seja o campo que contém o conteúdo HTML
            oContext.requestProperty("IsActiveEntity"), // Supondo que 'IsActiveEntity' seja o campo que indica se a entidade está ativa ou em rascunho
          ])
            .then(
              function (aValues) {
                var documentXstring = aValues[0];
                var isActiveEntity = aValues[1];

                // Somente leitura se a entidade estiver ativa, caso contrário, permite edição
                var editable = !isActiveEntity;

                var documentHTML = "";
                if (documentXstring) {
                  documentHTML = this._xstringToHTML(documentXstring);
                }

                oViewModel.setProperty("/htmlContent", documentHTML);
                oViewModel.setProperty("/isEditable", editable);

                if (oEditor) {
                  oEditor.setValue(documentHTML);
                  oEditor.setEditable(editable);
                }
              }.bind(this),
            )
            .catch((oError) => {
              MessageToast.error("Erro ao carregar dados: " + oError.message);
              console.error(oError);
            })
            .finally(() => {
              oViewModel.setProperty("/busy", false);
            });
        },

        _onEditorChange: function (oEvent) {
          var newHtml = oEvent.getParameter("newValue");

		      var documentXstring = "";
          if (newHtml) {
            documentXstring = this._htmlToXstring(newHtml);
          }

          var oContext = this.getView().getBindingContext();
          if (!oContext) {
            oContext = this.getView().getBindingContext();
          }

          if (!oContext) {
            MessageToast.error("Não foi identificado o contexto!");
          }

          oContext.setProperty("Document", documentXstring);
        },

        _xstringToHTML: function (str) {
          try {
            //Remove espaços
            var fixedStr = str.trim();

            // Corrige Base64URL, substituindo (-) por (+) e (_) por (/)
            fixedStr = fixedStr.replace(/-/g, "+").replace(/_/g, "/");

            return decodeURIComponent(
              Array.prototype.map
                .call(window.atob(fixedStr), function (c) {
                  return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join(""),
            );
          } catch (oError) {
            MessageToast.error(
              "Erro ao converter documento: " + oError.message,
            );
            console.error("Erro ao decodificar Xstring:", oError);
            return "";
          }
        },

        _htmlToXstring: function (str) {
          return window.btoa(
            encodeURIComponent(str).replace(
              /%([0-9A-F]{2})/g, 
              function (match, p1) {
              return String.fromCharCode("0x" + p1);
            }),
          );
        },

        override: {
          /**
           * Called when a controller is instantiated and its View controls (if available) are already created.
           * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
           * @memberOf br.com.descomplicando.swiki.ext.controller.ObjectPageExt
           */
          onInit: function () {
            var oViewModel = new JSONModel({
              htmlContent: "",
              busy: false,
              isEditable: false,
            });
            this.getView().setModel(oViewModel, "editorModel");

            this.getView().attachModelContextChange(
              this._onContextChanged.bind(this),
            );
          },
        },
      },
    );
  },
);
