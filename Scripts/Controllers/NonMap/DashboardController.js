//DashboardController
aceparking.controller('DashboardController', ['$scope', '$rootScope', '$routeParams', '$location', '$window'
    , 'moment', 'dataLayerService', 'user',
    function ($scope, $rootScope, $routeParams, $location, $window
        , moment, dataLayerService, user) {

        console.log("Dashboard Controller");

        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.showEmailAlert = false;

        user['LotNumber'] = $window.ln;
        user['CustomerId'] = $window.ci;
        user['EntityId'] = $window.ei;
        user['IsDeployed'] = $window.id;

        var lotNumber = user['LotNumber'];
        var customerId = user['CustomerId'];

        $scope.lotNumber = user['LotNumber'];
        $scope.accountNumber = 0;
        $scope.customerId = user['CustomerId'];

        if ($scope.userForm === null) {
            $scope.userForm = {};
            $scope.userForm.EmailAddress = '';
            $scope.userForm.EmailBody = '';
        }

        //grab querystring params (sample: #?searchType=Hourly&searchTerm=San+Diego) (Angular $location module needs hash before ?  i.e. #?param=val
        ($scope.loadLotData = function (lotNumber) {

            dataLayerService.getUserDashboard(lotNumber, customerId).then(function (response) {
                if (response.data) {
                    bindModel(response.data);
                }
                else {
                    //Need message center for errors and notifications
                }
            });
        })(lotNumber);

        $scope.postMessage = function () {

            var portalMessage = {
                'PortalMessageId': 0,
                'EntityId': user['EntityId'],
                'LotNumber': $scope.selected.LotNumber,
                'Message': $scope.messageText,
                'Reply': '',
                'DateEntered': moment.utc().format('YYYY-MM-DD HH:mm:ss'),
                'NotificationId': 0
            };

            dataLayerService.submitMessage(portalMessage)
                .then(function (results) {
                    if (results.data) {
                        $scope.showSuccessAlert = true;

                    } else {
                        $scope.showErrorAlert = true;
                    }
                });
        };

        $scope.addNotification = function(notificationType) {

            dataLayerService.addNotification($scope.lotNumber, $scope.selected.AccountNumber, notificationType)
                .then(function(response) {
                    if (response.data.Success) {
                        $scope.showSuccessAlert = true;
                        $scope.messageStatus = 'Nofication sent.  Thank you.';
                    } else {
                        $scope.showErrorAlert = true;
                        $scope.messageStatus = 'Error sending notification!';
                    }
                });
        };

        $scope.sendEmail = function () {
            var emailAddress1 = $scope.userForm.EmailAddress;
            var emailAddress2 = $scope.EmailAddress;
            var emailBody1 = $scope.userForm.EmailBody;
            var emailBody2 = $scope.EmailBody;

            dataLayerService.sendEmail($scope.customerId, emailAddress2, emailBody2)
                .then(function(response) {
                    if (response.data.Success) {
                        $scope.showEmailAlert = true;
                        $scope.messageStatus = 'Email sent.  Thank you.';
                    } else {
                        $scope.showEmailAlert = false;
                        $scope.messageStatus = 'Error sending email!';
                    }
                });
        };

        // Private methods
        function bindModel(dashboardModel) {
            // todo: make sure we have a non empty array of lots
            $scope.customerLots = dashboardModel.CustomerLots;
            $scope.selected = dashboardModel.CustomerLots[0];

            var size = dashboardModel.Transactions.length;
            var currentDate = new Date();
            var hourOffset = currentDate.getTimezoneOffset() / 60;
            for (var i = 0; i < size; i++) {
                var current = dashboardModel.Transactions[i].TransactionDate;
                // var currentTime = moment(current).add(hourOffset, 'hours').format('MM-DD-YYYY');
                var currentTime = moment(current).format('MM-DD-YYYY');
                dashboardModel.Transactions[i].TransactionDate = currentTime;
            }
            var templateLink = user['IsDeployed']
                ? '<a href="https://services.aceparking.com/CreatePdf/#=LotNumber#/#=InvoiceNumber#/-7" id="pdfLauncher" target="_blank">#=Description#</a>'
                : '<a href="http://localhost:9051/CreatePdf/#=LotNumber#/#=InvoiceNumber#/-7" id="pdfLauncher" target="_blank">#=Description#</a>';


            $("#notifications-grid").kendoGrid({
                dataSource: {
                    data: dashboardModel.Notifications,
                    schema: {
                        model: {
                            fields: {
                                NotificationDate: { type: "date" },
                                Notification: { type: "string" }
                            }
                        }
                    },
                },
                height: 212,
                filterable: false,
                sortable: true,
                pageable: false,
                columns: [
                    {
                        field: "NotificationDate",
                        title: "Date",
                        headerAttributes: {
                            'class': 'something',       // Since the CSS doesn't exist, nothing should happen
                            style: 'text-align: center'
                        },
                        format: "{0:MM-dd-yyyy}",
                        width: 90
                    },
                    {
                        field: "Notification",
                        title: "Message",
                        headerAttributes: {
                            'class': 'something',       // Since the CSS doesn't exist, nothing should happen
                            style: 'text-align: center'
                        },
                        filterable: false
                    }
                ]
            });

            $("#transactions-grid").kendoGrid({
                dataSource: {
                    data: dashboardModel.Transactions,
                    schema: {
                        model: {
                            fields: {
                                TransactionDate: { type: "string" },
                                TransactionType: { type: "string" },
                                Description: { type: "string" },
                                Amount: { type: "number" },
                                Balance: { type: "number" },
                                LotNumber: { type: "string" },
                                CustomerId: { type: "number" },
                            }
                        }
                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                },
                height: 450,
                filterable: false,
                sortable: true,
                pageable: true,
                columns: [
                {
                    field: "TransactionDate",
                    title: "Date",
                    headerAttributes: {
                        'class': 'something',       // Since the CSS doesn't exist, nothing should happen
                        style: 'text-align: center'
                    },
                    // format: "{0:MM-dd-yyyy}",
                    width: 80
                },
                {
                    field: "TransactionType",
                    title: "Transaction",
                    headerAttributes: {
                        'class': 'something',       // Since the CSS doesn't exist, nothing should happen
                        style: 'text-align: center'
                    },
                    filterable: false,
                    width: 100
                },
                {
                    field: "Description",
                    title: "Description",
                    template: templateLink,
                    headerAttributes: {
                        'class': 'something',       // Since the CSS doesn't exist, nothing should happen
                        style: 'text-align: center'
                    },
                    filterable: false,
                    width: 220
                },
                {
                    field: "Amount",
                    title: "Amount",
                    headerAttributes: {
                        'class': 'something',       // Since the CSS doesn't exist, nothing should happen
                        style: 'text-align: center'
                    },
                    format: "{0:c2}",
                    attributes: {
                        style: 'text-align: right;'
                    },
                    width: 60
                },
                {
                    field: "Balance",
                    title: "Balance",
                    headerAttributes: {
                        'class': 'something',       // Since the CSS doesn't exist, nothing should happen
                        style: 'text-align: center'
                    },
                    format: "{0:c2}",
                    attributes: {
                        style: 'text-align: right;'
                    },
                    width: 60
                }
                ]
            });
        };

    }
]);

//PayBalanceDue
aceparking.controller('PayBalanceDueController', [
    '$scope', '$rootScope', '$q', '$location', 'dataLayerService', 'moment', 'numeral', 'user', 'commonLib',
    function ($scope, $rootScope, $q, $location, dataLayerService, moment, numeral, user, commonLib) {
        console.log("PayBalanceDueController");

        $scope.show = true;
        $scope.paymentReceived = false;
        $scope.errorOccurred = false;
        $scope.processing = false;
        $scope.customerId = user['CustomerId'];
        $scope.lotNumber = user['LotNumber'];
        $scope.formId = '';
        $scope.common = commonLib;
        $scope.singleInvoice = false;
        $scope.multipeInvoices = false;
        $scope.AmountDue = 0;

        console.log('PayBalanceDueController - Customer Id:  ' + user['CustomerId']);
        console.log('PayBalanceDueController - Lot Number:  ' + user['LotNumber']);

        var toPayeezyObject = {
            "merchant_ref": "string",
            "transaction_type": "authorize",
            "method": "token",
            "amount": 0,
            "currency_code": "USD",
            "token": {
                "token_type": "FDToken",
                "token_data": {
                    "type": "",
                    "value": "",
                    "cardholder_name": "",
                    "exp_date": "",
                    "cvv": "",
                    "special_payment": ""
                }
            }
        };

        var customerTransactionObject = {
            "CustomerId": $scope.customerId,
            "LotNumber": $scope.lotNumber,
            "EntityId": "",
            "TransactionDate": moment.utc(),
            "TransactionId": "",
            "InvoiceNumber": "",
            "Description": "Paid balance due",
            "Amount": $scope.AmountDue,
            "CurrentTotal": $scope.AmountDue,
            "TransactionType": "Payment",
            "IsViewable": 0
        };
        var multipleTransactions = [];
        var globalBalance = 0;

        // TODO:  Why is this getting called when Company Validations is invoked
        dataLayerService.getUserDashboard($scope.lotNumber, $scope.customerId).then(function (response) {
            if (response.data.Transactions !== null) {

                $scope.globalBalance = response.data.CustomerLots[0].Balance;
                $scope.AccountNumber = response.data.CustomerLots[0].AccountNumber;
                $scope.formId = response.data.Digits;
                

                // get all invoices, not paid i.e TransactionId==""
                $scope.Transactions_Invoices_OBJ = [];
                for (var i = 0; i < response.data.Transactions.length; i++) {
                    if (response.data.Transactions[i].TransactionId === "") {
                        $scope.Transactions_Invoices_OBJ.push({
                            InvoiceNumber: response.data.Transactions[i].InvoiceNumber
                        });
                    }
                }

                $scope.Transactions_OBJ = [];
                // can be many transactions per invoice, we need the last balance
                $scope.Transactions_Temp_OBJ = [];
                $scope.Transactions_Invoices_OBJ.forEach(function (value) {
                    for (var i = 0; i < response.data.Transactions.length; i++) {
                        if (response.data.Transactions[i].InvoiceNumber === value.InvoiceNumber) {
                            $scope.Transactions_Temp_OBJ.push({
                                Balance: response.data.Transactions[i].Balance,
                                InvoiceNumber: response.data.Transactions[i].InvoiceNumber,
                                Amount: response.data.Transactions[i].Amount,
                                TransactionType: response.data.Transactions[i].TransactionType
                            });
                        }
                    }
                    //the last Amount/InvoiceNumber, show if not paid
                    var lastIndex = $scope.Transactions_Temp_OBJ.length - 1;
                    if ($scope.Transactions_Temp_OBJ[lastIndex].Amount !== 0
                        && $scope.Transactions_Temp_OBJ[lastIndex].TransactionType !== "Payment") {
                        $scope.Transactions_OBJ.push({
                            Amount: $scope.Transactions_Temp_OBJ[lastIndex].Amount,
                            InvoiceNumber: $scope.Transactions_Temp_OBJ[lastIndex].InvoiceNumber
                        });
                    }

                    $scope.Transactions_Temp_OBJ = [];
                });


                // TODO:  Modify this to transistion from $scope.Transactions_OBJ.length to 
                // response.data.UnpaidInvoices
                if ($scope.Transactions_OBJ.length === 0) {

                    for (var k = 0, max = response.data.UnpaidInvoices.length; k < max; k++) {
                        var current = {
                            'InvoiceNumber': response.data.UnpaidInvoices[k].InvoiceNumber,
                            'Amount': response.data.UnpaidInvoices[k].Amount
                        };
                        $scope.Transactions_OBJ.push(current);
                        globalBalance += response.data.UnpaidInvoices[k].Amount;
                    }
                }

                $scope.singleInvoice = $scope.Transactions_OBJ.length === 1;
                $scope.multipleInvoices = $scope.Transactions_OBJ.length > 1;
                $scope.AmountDue = globalBalance;
                $scope.globalBalance = globalBalance;
                

                //disable DropDown, Submit. Nothing to pay
                if ($scope.AmountDue === 0) {
                    $scope.paymentReceived = true;
                }

                $scope.Payment = globalBalance;
                $scope.formattedAmountDue = $scope.common.toCurrency($scope.AmountDue);
            }
            else {
                //Need message center for errors and notifications
            }
        });

        //
        $scope.formattedAmountDue = $scope.common.toCurrency($scope.globalBalance);
        $scope.Payment = $scope.AmountDue;
        $scope.matchPartialPayment = new RegExp("^\\$+[0-9]+(\\.[0-9]{2})?$");

        $scope.selectInvoice = function (invoiceAmount, invoiceNumber, transactionType) {

            if (invoiceAmount === undefined) invoiceAmount = numeral().unformat($scope.globalBalance);

            $scope.Payment = invoiceAmount.toFixed(2);
            $scope.formattedAmountDue = $scope.common.toCurrency(invoiceAmount);

            $scope.InvoiceNumber = invoiceNumber;
            $scope.PaymentPerInvoice = invoiceAmount;
            $scope.InvoicePaid = transactionType;

            //all payments are valid, so
            $scope.invalidPayment = false;
            if ($scope.InvoicePaid === "Payment") {
                $scope.invalidPayment = true;
            }
        };

        var payeezyAmount = 0.0;
        var isPayingAllInvoices = false;

        $scope.submitPayment = function (payment) {
            $scope.errorOccurred = false;
            $scope.invalidPayment = false;
            $scope.processing = true;

            // Get the sum of all invoices
            var sumOfAllInvoices = parseFloat($scope.common.sumByProperty($scope.Transactions_OBJ, 'Amount'));
            payment = parseFloat(payment);

            // When submitting a payment, there will *ALWAYS* be one single invoice being paid or 
            // many invoices.
            if (payment === sumOfAllInvoices && $scope.multipleInvoices) {
                isPayingAllInvoices = true;
                for (var k = 0, max = $scope.Transactions_OBJ.length; k < max; k++) {

                    var copiedObject = Object.assign({}, customerTransactionObject);
                    copiedObject.InvoiceNumber = $scope.Transactions_OBJ[k].InvoiceNumber;
                    copiedObject.Amount = $scope.Transactions_OBJ[k].Amount;
                    copiedObject.TotalAmount = $scope.Transactions_OBJ[k].Amount;
                    multipleTransactions.push(copiedObject);
                }

            } else {
                customerTransactionObject.InvoiceNumber = $scope.Transactions_OBJ[0].InvoiceNumber;
                customerTransactionObject.Amount = $scope.Transactions_OBJ[0].Amount;
                multipleTransactions.push(customerTransactionObject);
            }

            // Payeezy accepts payments i.e. $100.00, $153.44, *however*, the dollar amount must be multiplied 
            // by 100 to remove the .cents portion of a given amount.  Of course, the '$' and any ',' characters 
            // must be removed
            var toPayEasy = (Number(payment) * 100).toFixed(0);
            payeezyAmount = Number(payment);

            dataLayerService.getTokenDataByCustomerId($scope.customerId)
                // 1.  Get the payeezy token stored by customer id
                .then(function (results) {
                    if (results.data) {
                        var data = results.data.Details;

                        toPayeezyObject.amount = toPayEasy;
                        toPayeezyObject.token.token_data = {
                            'type': data.CreditCardType,
                            'value': data.Token,
                            'cardholder_name': data.FullName,
                            'exp_date': data.CreditCardExpiration
                        };

                        if ($scope.multipeInvoices) {
                            for (var k = 0, max = multipleTransactions.length; k < max; k++) {
                                multipleTransactions[k].EntityId = data.EntityId;
                                multipleTransactions[k].TransactionDate = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                            }
                        } else {
                            multipleTransactions[0].EntityId = data.EntityId;
                            multipleTransactions[0].TransactionDate = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                        }


                        return dataLayerService.makeTokenPayment(toPayeezyObject);
                    } else {
                        $scope.errorOccurred = true;
                        $scope.payBalanceError = 'Could not retrieve token.';
                    }
                })
                // 2.  Process the the payeezy data
                .then(function (results) {
                    if (results.data) {
                        var data = results.data;
                        
                        var payeezyResponse = {
                            "TransactionResultId": 0,
                            "CustomerId": $scope.customerId,
                            "TransactionId": data.transaction_id,
                            "TransactionStatus": data.transaction_status,
                            "TransactionType": data.transaction_type,
                            "DateEntered": moment.utc()
                        };

                        for (var k = 0, max = multipleTransactions.length; k < max; k++) {
                            multipleTransactions[k].TransactionId = data.transaction_id;
                            multipleTransactions[k].TransactionDate = moment.utc();
                        }

                        return dataLayerService.postTransactionResult(payeezyResponse);
                    } else {
                        $scope.errorOccurred = true;
                        $scope.payBalanceError = 'Could not process transaction.';
                    }
                })
                // 3.  Process the payeezy transaction
                .then(function (results) {
                    if (results.data) {
                        var t = 'test';
                        return dataLayerService.postCustomerTransaction(multipleTransactions);
                    } else {
                        $scope.errorOccurred = true;
                        $scope.payBalanceError = 'Could not update internal records.';
                    }
                })
                // Balance is updated in CustomerController endpoint
                .then(function (results) {
                    $scope.processing = false;
                    if (results.data.Details !== null) {
                        //customer can pay few invoices, don't disable Submit
                        $scope.paymentReceived = true;
                    } else {
                        $scope.errorOccurred = true;
                        $scope.payBalanceError = 'Could not update account.';
                    }
                });
        }
    }]);