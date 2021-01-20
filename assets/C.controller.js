sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/SimpleType",
    "sap/ui/model/ValidateException",
    "sap/ui/core/Core",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, JSONModel, SimpleType, ValidateException, Core, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("sap.m.sample.InputChecked.C", {

        onInit: function () {
            var oView = this.getView(),
                oMM = Core.getMessageManager();

            oView.setModel(new JSONModel({email: ""}));
            // attach handlers for validation errors

            oMM.registerObject(oView.byId("emailInput"), true);
            oMM.registerObject(oView.byId("sifre"), true);
        },

        _validateInput: function (oInput) {
            var sValueState = "None";
            var bValidationError = false;
            var oBinding = oInput.getBinding("value");

            try {
                oBinding.getType().validateValue(oInput.getValue());
            } catch (oException) {
                sValueState = "Error";
                bValidationError = true;
            }

            oInput.setValueState(sValueState);

            return bValidationError;
        },

        onNameChange: function (oEvent) {
            var oInput = oEvent.getSource();
            this._validateInput(oInput);
        },

        onSubmit: function () {
            // collect input controls
            var oView = this.getView(),
                aInputs = [
                    oView.byId("sifre"),
                    oView.byId("emailInput")
                ],
                bValidationError = false;

            // Check that inputs are not empty.
            // Validation does not happen during data binding as this is only triggered by user actions.
            aInputs.forEach(function (oInput) {
                bValidationError = this._validateInput(oInput) || bValidationError;
            }, this);
            if (!bValidationError) {
                var sifre = this.getView().byId("sifre").getValue();
                var email = this.getView().byId("emailInput").getValue();
                $.ajax({
                    url: '/validator/login',
                    type: 'POST',
                    data: $.param({"email": email, "sifre": sifre}),
                    contentType: 'application/x-www-form-urlencoded',
                    success: function (data) {
                       if(data['durum']){
                        MessageToast.show(data['mesaj']+' Email Adresi: '+ data['email']);

                        }else{
                            if(data['mesaj']['email']){

                                MessageToast.show(data['mesaj']['email']+' Email Adresi: '+ email);
                            }
                            if(data['mesaj']['pass']){

                                MessageToast.show(data['mesaj']['pass']);
                            }
                        }

                    },
                    error: function (e) {
                            MessageBox.alert("Kayıt Oluştururken Hata Oluştu");
                    }
                });

            } else {
                MessageBox.alert("Gerekli Alanları Doğru Şekilde Doldurunuz");
            }
        },

        /**
         * Custom model type for validating an E-Mail address
         * @class
         * @extends sap.ui.model.SimpleType
         */
        customEMailType: SimpleType.extend("email", {
            formatValue: function (oValue) {
                return oValue;
            },

            parseValue: function (oValue) {
                //parsing step takes place before validating step, value could be altered here
                return oValue;
            },

            validateValue: function (oValue) {
                // The following Regex is only used for demonstration purposes and does not cover all variations of email addresses.
                // It's always better to validate an address by simply sending an e-mail to it.
                var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
                if (!oValue.match(rexMail)) {
                    throw new ValidateException("'" + oValue + "' Kullanılabilir Bir Mail Adresi Değil");
                }
            }
        }),
        sifretype: SimpleType.extend("sifre", {
            formatValue: function (oValue) {
                return oValue;
            },

            parseValue: function (oValue) {
                //parsing step takes place before validating step, value could be altered here
                return oValue;
            },

            validateValue: function (oValue) {
                // The following Regex is only used for demonstration purposes and does not cover all variations of email addresses.
                // It's always better to validate an address by simply sending an e-mail to it.
                // emailInput
                var passr;
                passr = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;

                if (!oValue.match(passr)) {
                    throw new ValidateException("'" + oValue + "' Şifrenizde en az 1 küçük 1 büyük harf, 1 özel karakter ve 1 sayı bulunmalıdır");
                }
            }
        })

    });
});