aceparking.service('dataLayerService',
    ['companionship', '$http', '$q', '$location',
        function(companionship, $http, $q, $location) {

            // This will automatically be set to production path via Web.Config transform
            var rootPath = companionship;
            console.log('dataLayerService');
            console.log('Starting lot search:  ' + rootPath + "Lot/lotSearch");

            return {
                //Search & Lot Details
                getLots: function(type, term) {
                    console.log('Starting lot search:  ' + rootPath + "Lot/lotSearch");
                    return $http.get(rootPath + "Lot/lotSearch",
                        {
                            params: {
                                searchType: type,
                                searchTerm: term
                            },
                            cache: false
                        });
                },
                getLotDetails: function(type, lotID) {
                    return $http.get(rootPath + "Lot/LotData",
                        {
                            params: {
                                searchType: type,
                                Id: lotID
                            },
                            cache: false
                        });
                },
                getLotRateSearch: function(lotNumber) {
                    return $http.get(rootPath + "Lot/LotRateSearch",
                        {
                            params: {
                                lotNumber: lotNumber
                            },
                            cache: false
                        });
                },
                //User Registration
                registerUser: function(userForm) {
                    var form = JSON.stringify(userForm);
                    //need callback etc.
                    $http.post(rootPath + "Account/Register",
                        {
                            params: {
                                form: form
                            }
                        });
                },
                //Populate listBaseRateObj for parking request
                getListBaseRateObj: function(lotNumber) {
                    return $http.get(rootPath + "Lot/GetBaseRates",
                        {
                            params: {
                                lotNumber: lotNumber
                            },
                            cache: false
                        });
                },
                getCustomerById: function(customerId) {

                    return $http.get(rootPath + "Customer/GetCustomerById",
                        {
                            params: {
                                customerId: customerId
                            },
                            cache: false
                        });
                },
                getCustomerProfile: function (lotNumber,customerId) {

                    return $http.get(rootPath + "Customer/GetCustomerProfile",
                        {
                            params: {
                                lotNumber: lotNumber,
                                customerId: customerId
                            },
                            cache: false
                        });
                },
                getCustomerParkings: function(lotNumber, customerId) {
                    return $http.get(rootPath + "Customer/GetCustomerParkings",
                        {
                            params: {
                                lotNumber: lotNumber,
                                customerId: customerId
                            },
                            cache: false
                        });
                },
                //PUT UpdateCustomerAsync 
                putUpdateAccount: function (customer) {

                    var form = JSON.stringify(customer);

                    return $http.get(rootPath + "Customer/UpdateCustomer", {
                        params: {
                            customer: form

                        },
                        cache: false
                    });

                },
                //POST CreateAccount
                postCreateAccount: function (type, term, customer) {
                    var httpURL = rootPath + "api/Customer";
                    return $http.post(httpURL, customer);
                },
                // START - Register New User
                getTokenViaApi: function(payeezy) {
                    var httpUrl = rootPath + 'Payeezy/GetPayeezyTokenTask';

                    var config = {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    }

                    return $http.post(httpUrl, JSON.stringify(payeezy));
                },
                addCustomerViaApi: function (customer) {
                    var httpUrl = rootPath + 'Customer/InsertCustomer';
                    return $http.post(httpUrl, customer);
                },
                // START - Pay Balance Due
                getTokenDataByCustomerId: function (customerId) {

                    return $http.get(rootPath + "Customer/GetTokenByCustomerId", {
                        params: {
                            customerId: customerId
                        },
                        cache: false
                    });
                },
                //POST MakeTokenPayment
                makeTokenPayment: function (payeezyObject) {

                    var httpURL = rootPath + "Payeezy/MakeTokenPayment";

                    var config = {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    }

                    return $http.post(httpURL, JSON.stringify(payeezyObject));
                },
                //POST /TransactionResult 
                postTransactionResult: function (FromPayeasyOBJ) {

                    var httpURL = rootPath + "Payeezy/PostTransactionResult";

                    return $http.post(httpURL, FromPayeasyOBJ);
                },
                //POST /DashboardTransactionPost
                postCustomerTransaction: function (CustomerTransactionOBJ) {

                    // DashboardTransactionPost
                    var httpURL = rootPath + "Customer/PostCustomerTransaction";

                    return $http.post(httpURL, CustomerTransactionOBJ);
                },
                //POST, Account table, e.g: /AccountUpdate/104938/32.01/
                postAccountUpdate: function (accountNumber, balance) {

                    return $http.post(rootPath + "Customer/UpdateAccount",
                        {
                            accountNumber: accountNumber,
                            balance: balance
                        }
                    );

                }, // END - Pay Balance Due
                getUserDashboard: function (lotNumber, customerId) {

                    return $http.get(rootPath + "Dashboard/GetData", {
                        params: {
                            lotNumber: lotNumber,
                            customerId: customerId
                        },
                        cache: false
                    });
                },
                // notificationType can be TERMINATE or LOSTCARD
                addNotification: function (lotNumber, accountNumber, notificationType) {
                    return $http.post(rootPath + "Dashboard/AddNotification", 
                        {
                            lotNumber: lotNumber,
                            accountNumber: accountNumber,
                            notificationType: notificationType
                        }
                    );
                },
                sendEmail: function(customerId, emailAddress, emailBody) {
                    return $http.post(rootPath + "Dashboard/SendEmail",
                        {
                            customerId: customerId,
                            emailAddress: emailAddress,
                            emailBody: emailBody
                        });
                },
               
                // end Forgot Password
                openPdf: function(lotNumber, invoiceNumber, timezoneOffset) {
                    $http.get(rootPath + "Dashboard/OpenPdf",
                        {
                            lotNumber: lotNumber,
                            invoiceNumber: invoiceNumber,
                            timezoneOffset: timezoneOffset
                        });
                },
                // Deprecate in favor of submitMessage
                contactUs: function (customerId, lotNumber, message) {
                    //need callback etc.
                    return $http.post(rootPath + "Dashboard/PostCustomerMessage",
                        {
                            customerId: customerId,
                            lotNumber: lotNumber,
                            message: message
                        }
                    );
                },
                // the following methods are for Corporate (i.e. Company) methods
                getCompanyProfile: function (lotNumber, companyId) {
                    return $http.get(rootPath + "CompanyDashboard/GetCompanyProfile", {
                        params: {
                            lotNumber: lotNumber,
                            companyId: companyId
                        },
                        cache: false
                    });
                },
                updateProfileViaApi: function (companyProfile) {
                    var httpUrl = rootPath + 'CompanyDashboard/UpdateCompanyProfile';
                    return $http.post(httpUrl, companyProfile);
                },
                // This is used by Parker Listing Export
                getParkerListing: function(lotNumber, companyId) {
                    return $http.get(rootPath + "CompanyDashboard/GetParkerListing", {
                        params: {
                            lotNumber: lotNumber,
                            companyId: companyId
                        },
                        cache: false
                    });
                },
                getParkerProfile: function(lotNumber, parkerId) {
                    return $http.get(rootPath + "CompanyDashboard/GetParkerProfile", {
                        params: {
                            lotNumber: lotNumber,
                            parkerId: parkerId
                        },
                        cache: false
                    });
                },
                getParkerValidations: function(lotNumber, parkerId) {
                    return $http.get(rootPath + "CompanyDashboard/GetParkerValidations", {
                        params: {
                            lotNumber: lotNumber,
                            parkerId: parkerId
                        },
                        cache: false
                    });
                },
                getCompanyValidations: function (lotNumber, companyId) {
                    return $http.get(rootPath + "CompanyDashboard/GetCompanyValidations", {
                        params: {
                            lotNumber: lotNumber,
                            companyId: companyId
                        },
                        cache: false
                    });
                },
                getKeycardData: function (lotNumber, parkerId) {
                    return $http.get(rootPath + "CompanyDashboard/GetKeycardInfo", {
                        params: {
                            lotNumber: lotNumber,
                            parkerId: parkerId
                        },
                        cache: false
                    });
                },
                addNewKeycardViaApi: function(keycardOrder) {
                    var httpUrl = rootPath + 'CompanyDashboard/OrderNewKeycard';
                    return $http.post(httpUrl, keycardOrder);
                },
                getRecentKeycardOrder: function (lotNumber, parkerId) {
                    return $http.get(rootPath + "CompanyDashboard/GetRecentKeycardOrder", {
                        params: {
                            lotNumber: lotNumber,
                            parkerId: parkerId
                        },
                        cache: false
                    });
                },
                getCompanyDashboardModel: function(lotNumber, companyId, parkerId) {
                    return $http.get(rootPath + "CompanyDashboard/GetCompanyDashboard", {
                        params: {
                            lotNumber: lotNumber,
                            companyId: companyId,
                            parkerId: parkerId
                        },
                        cache: false
                    });
                },
                postPayment: function(payment) {
                    var httpURL = rootPath + "Payeezy/PostPayment";

                    var config = {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    }

                    return $http.post(httpURL, JSON.stringify(payment));
                },
                postPurchase: function (purchaseOrder) {
                    var httpUrl = rootPath + 'CompanyDashboard/PostPurchase';
                    return $http.post(httpUrl, purchaseOrder);
                },
                addNewValidationViaApi: function(validationOrder) {
                    var httpUrl = rootPath + 'CompanyDashboard/OrderValidation';
                    return $http.post(httpUrl, validationOrder);
                },
                //add Notification when Validations,KeycardOrder get updated(addNewValidationViaApi)
                insertNotification: function (notification) {
                    var httpUrl = rootPath + 'CompanyDashboard/InsertNotification';
                    return $http.post(httpUrl, notification);
                },
                getRecentValidationOrder: function(validationOrderId) {
                    return $http.get(rootPath + "CompanyDashboard/GetRecentValidationOrder", {
                        params: {
                            validationOrderId: validationOrderId
                        },
                        cache: false
                    });                    
                },
                submitMessage: function (portalMessage) {
                    var httpUrl = rootPath + 'CompanyDashboard/PostMessage';
                    return $http.post(httpUrl, portalMessage);
                },
                addUserToQueue: function(newApplication) {
                    var httpUrl = rootPath + 'CompanyDashboard/AddUserToQueue';
                    return $http.post(httpUrl, newApplication);                    
                },
                getOutstandingBalances: function (lotNumber, entityId) {
                    return $http.get(rootPath + "CompanyDashboard/GetOutstandingBalances", {
                        params: {
                            lotNumber: lotNumber,
                            entityId: entityId
                        },
                        cache: false
                    });
                },
                addNewMessage: function(message) {
                    return $http.post(rootPath + 'CompanyDashboard/AddNewMessage',
                        {
                            message: message
                        }
                    );
                },
                getParkerUpdate: function (lotNumber, entityId) {
                    return $http.get(rootPath + "CompanyDashboard/GetParkerUpdate", {
                        params: {
                            lotNumber: lotNumber,
                            entityId: entityId
                        },
                        cache: false
                    });
                },
                updateParker: function(parker) {
                    return $http.post(rootPath + 'CompanyDashboard/UpdateCompanyParker',
                        {
                            parkerModel: parker
                        }
                    );                    
                }
            };
}]);