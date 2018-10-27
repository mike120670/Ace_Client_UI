// CompanyDashboardController
aceparking.controller('CompanyDashboardController', ['$scope', '$rootScope', '$routeParams', '$location', 'moment'
    , '$window', 'dataLayerService', 'staticDataLayerService', 'commonLib', 'company',
    function ($scope, $rootScope, $routeParams, $location, moment
        , $window, dataLayerService, staticDataLayerService, commonLib, company) {

        console.log("CompanyDashboardController Controller");

        // TODO:  Move common variable declarations to a factory to reduce clutter
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.showEmailAlert = false;
        $scope.messageText = '';

        company['LotNumber'] = $window.ln;
        company['EntityId'] = $window.ei;
        company['CompanyId'] = $window.ci;
        company['Username'] = $window.un;
        company['IsDeployed'] = $window.id;
        company['IsPortalAdmin'] = $window.ipa;

        console.log('CompanyDashboardController - LotNumber:  ' + company['LotNumber']);
        console.log('CompanyDashboardController - EntityId:  ' + company['EntityId']);
        console.log('Is Portal Admin:  ' + company['IsPortalAdmin']);
        // END - Common variable declaration

        $scope.states = staticDataLayerService.getStates();
        $scope.common = commonLib;
        $scope.Company = {};

        dataLayerService.getCompanyDashboardModel(company['LotNumber'], company['CompanyId'], company['EntityId'])
            .then(function (results) {
            if (results.data) {
                bindModel(results.data);
            } else {
                //Need message center for errors and notifications
            }
        });

        $scope.submitMessage = function () {
            var portalMessage = {
                'PortalMessageId': 0,
                'EntityId': company['EntityId'],
                'LotNumber': company['LotNumber'],
                'Message': $scope.messageText,
                'Reply': '',
                'ParkerNotificationId': 0,
                'DateEntered': moment.utc().format('YYYY-MM-DD HH:mm:ss')
            };

            dataLayerService.submitMessage(portalMessage)
                .then(function (results) {
                    if (results.data) {
                        $scope.showSuccessAlert = true;

                    } else {
                        $scope.showErrorAlert = true;
                    }
                });
        }

        // Private methods
        function bindModel(dashboardModel) {

            console.log('Beginning to bindModel');

            $('#notifications-grid').kendoGrid({
                dataSource: {
                    data: dashboardModel.CompanyNotifications,
                    schema: {
                        model: {
                            fields: {
                                NotificationDate: { type: "string" },
                                Description: { type: "string" }
                            }
                        }
                    },
                    pageSize: 5,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                },
                height: 200,
                filterable: false,
                scrollable: true,
                sortable: true,
                pageable: true,
                columns: [
                    {
                        field: "NotificationDate",
                        title: "Date",
                        headerAttributes: {
                            'class': 'something',       // Since the CSS doesn't exist, nothing should happen
                            style: 'text-align: center'
                        },
                        filterable: false,
                        width: 50
                    },
                    {
                        field: "Description",
                        title: "Description",
                        headerAttributes: {
                            'class': 'something',       // Since the CSS doesn't exist, nothing should happen
                            style: 'text-align: center'
                        },
                        filterable: false,
                        width: 150
                    }
                ]
            });

            var size = dashboardModel.CompanyBillingHistory.length;
            var currentDate = new Date();
            var hourOffset = currentDate.getTimezoneOffset() / 60;
            for (var i = 0; i < size; i++) {
                var current = dashboardModel.CompanyBillingHistory[i].InvoiceDate;
                var currentTime = moment(current).add(hourOffset, 'hours').format('MM-DD-YYYY');
                dashboardModel.CompanyBillingHistory[i].InvoiceDate = currentTime;
            }
            var templateLink = company['IsDeployed']
                ? '<a href="https://services.aceparking.com/CreatePdf/#=LotNumber#/#=InvoiceNumber#/-7" id="pdfLauncher" target="_blank">#=Description#</a>'
                : '<a href="http://localhost:9051/CreatePdf/#=LotNumber#/#=InvoiceNumber#/-7" id="pdfLauncher" target="_blank">#=Description#</a>';

            $("#transactions-grid").kendoGrid({
                dataSource: {
                    data: dashboardModel.CompanyBillingHistory,
                    schema: {
                        model: {
                            fields: {
                                InvoiceDate: { type: "string" },
                                Transaction: { type: "string" },
                                Description: { type: "string" },
                                Rate: { type: "number" },
                                Balance: { type: "number" }
                            }
                        }
                    },
                    pageSize: 7,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                },
                height: 450,
                filterable: false,
                scrollable: true,
                sortable: true,
                pageable: true,
                columns: [
                    {
                        field: "InvoiceDate",
                        title: "Date",
                        headerAttributes: {
                            'class': 'something',       // Since the CSS doesn't exist, nothing should happen
                            style: 'text-align: center'
                        },
                        // format: "{0:MM-dd-yyyy}",
                        width: 70
                    },
                    {
                        field: "Transaction",
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
                        width: 200
                    },
                    {
                        field: "Rate",
                        title: "Amount",
                        headerAttributes: {
                            'class': 'something',       // Since the CSS doesn't exist, nothing should happen
                            style: 'text-align: center'
                        },
                        format: "{0:c2}",
                        attributes: {
                            style: 'text-align: right;'
                        },
                        width: 70
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
                        width: 70
                    }
                ]
            });
        }
    }
]);

// CompanyProfileController
aceparking.controller('CompanyProfileController', ['$scope', '$rootScope', '$routeParams', '$location'
    , '$window', 'dataLayerService', 'staticDataLayerService', 'commonLib', 'company',
    function ($scope, $rootScope, $routeParams, $location, $window, dataLayerService, staticDataLayerService, commonLib, company) {

        console.log("CompanyProfileController Controller");

        // TODO:  Move common variable declarations to a factory to reduce clutter
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.showEmailAlert = false;

        company['LotNumber'] = $window.ln;
        company['EntityId'] = $window.ei;
        company['CompanyId'] = $window.ci;
        company['Username'] = $window.un;
        company['IsPortalAdmin'] = $window.ipa;
        console.log('Is Portal Admin:  ' + company['IsPortalAdmin']);

        // END - common variable declaration

        $scope.states = staticDataLayerService.getStates();
        $scope.common = commonLib;
        $scope.Company = {};

        $scope.getCompanyProfile = function (lotNumber, companyId) {
            dataLayerService.getCompanyProfile(lotNumber, companyId)
                .then(function (results) {
                    if (results.data) {
                        var profileData = results.data;
                        $scope.Company.CompanyName = profileData.CompanyName;
                        $scope.Company.DBA = profileData.DBA;
                        $scope.Company.CompanyAddress = profileData.CompanyAddress;
                        $scope.Company.CompanyAddressLine = profileData.CompanyAddressLine;
                        $scope.Company.CompanyCity = profileData.CompanyCity;
                        $scope.Company.CompanyPhone = $scope.common.formatPhone(profileData.CompanyPhone);
                        $scope.Company.CompanyState = profileData.CompanyState;
                        $scope.Company.CompanyZipCode = profileData.CompanyZipCode;
                        $scope.Company.EmailAddress = profileData.EmailAddress;

                        $scope.Company.BillingAddress = profileData.BillingAddress;
                        $scope.Company.BillingAddressLine = profileData.BillingAddressLine;
                        $scope.Company.BillingCity = profileData.BillingCity;
                        $scope.Company.BillingPhone = $scope.common.formatPhone(profileData.BillingPhone);
                        $scope.Company.BillingState = profileData.BillingState;
                        $scope.Company.BillingZipCode = profileData.BillingZipCode;

                        if (profileData.DailyContact === '') {
                            $scope.Company.FirstName = '';
                            $scope.Company.LastName = '';
                        } else {

                            var dailyContact = profileData.DailyContact;
                            if (!$scope.common.isNullOrEmpty(dailyContact)) {
                                var dc = dailyContact.split(' ');
                                $scope.Company.BillingLastName = dc.pop();
                                $scope.Company.BillingFirstName = dc.join(' ');
                            }
                        }
                        //BillingDailyContact
                        if (profileData.BillingDailyContact === '') {
                            $scope.Company.BillingFirstName = '';
                            $scope.Company.BillingLastName = '';
                        } else {

                            var billingDailyContact = profileData.BillingDailyContact;
                            if (!$scope.common.isNullOrEmpty(profileData.BillingDailyContact)) {
                                var bdc = billingDailyContact.split(' ');
                                $scope.Company.BillingLastName = bdc.pop();
                                $scope.Company.BillingFirstName = bdc.join(' ');
                            }

                        }

                    } else {
                        console.log('An error occurred');
                    }
                });
        }

        var results = $scope.getCompanyProfile(company['LotNumber'], company['CompanyId']);

        // function to submit the form after all validation has occurred			
        $scope.submitForm = function (isValid) {

            if (isValid) {
                var companyProfile = {};

                companyProfile.LotNumber = company['LotNumber'];
                companyProfile.CompanyId = company['CompanyId'];
                companyProfile.CompanyName = $scope.Company.CompanyName;
                companyProfile.DBA = $scope.Company.DBA;
                companyProfile.CompanyAddress = $scope.Company.CompanyAddress;
                companyProfile.CompanyAddressLine = $scope.Company.CompanyAddressLine;
                companyProfile.CompanyCity = $scope.Company.CompanyCity;
                companyProfile.CompanyState = $scope.Company.CompanyState;
                companyProfile.CompanyZipCode = $scope.Company.CompanyZipCode;
                companyProfile.CompanyPhone = $scope.common.cleanPhone($scope.Company.CompanyPhone);

                companyProfile.DailyContact = $scope.Company.FirstName + ' ' + $scope.Company.LastName;
                companyProfile.EmailAddress = $scope.Company.EmailAddress;

                //BillingDailyContact
                companyProfile.BillingDailyContact = $scope.Company.BillingFirstName + ' ' + $scope.Company.BillingLastName;

                companyProfile.BillingAddress = $scope.Company.BillingAddress;
                companyProfile.BillingAddressLine = $scope.Company.BillingAddressLine;
                companyProfile.BillingCity = $scope.Company.BillingCity;
                companyProfile.BillingState = $scope.Company.BillingState;
                companyProfile.BillingZipCode = $scope.Company.BillingZipCode;
                companyProfile.BillingPhone = $scope.common.cleanPhone($scope.Company.BillingPhone);
                companyProfile.Username = company['Username'];

                var t = 'breakpoint';

                dataLayerService.updateProfileViaApi(companyProfile).then(function (results) {
                    if (results.data) {
                        var companyProfileResults = results.data;
                        $scope.showSuccessAlert = true;
                    } else {
                        console.log('An error occurred...');
                    }
                });
            }
        };
    }
]);

// ParkerListingController
aceparking.controller('ParkerListingController', ['$scope', '$rootScope', '$routeParams', '$location'
    , '$window', 'dataLayerService', 'staticDataLayerService'
    , 'commonLib', 'company', 'moment',
    function ($scope, $rootScope, $routeParams, $location, $window, dataLayerService, staticDataLayerService
        , commonLib, company, moment) {

        console.log("ParkerListingController Controller");

        // TODO:  Move common variable declarations to a factory to reduce clutter
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.showEmailAlert = false;
        $scope.isDuplicateStallNumber = false;
        $scope.enableAddButton = true;
        $scope.companyName = '';

        company['LotNumber'] = $window.ln;
        company['EntityId'] = $window.ei;
        company['CompanyId'] = $window.ci;
        company['Username'] = $window.un;
        company['IsPortalAdmin'] = $window.ipa;

        var lotNumber = company['LotNumber'];
        var companyId = company['CompanyId'];
        var isPortalAdmin = company['IsPortalAdmin'];
        var parkers = [];

        console.log('LotNumber:  ' + lotNumber);
        console.log('Company Id:  ' + companyId);
        // END - common variable declarations

        $scope.common = commonLib;
        $scope.sortName = 'FirstName';   // set the default sort column name
        $scope.sortReverse = false;             // set the default sort order

        $scope.NewDateEntered = '';

        // http://plnkr.co/edit/KRo9X5?p=preview
        ($scope.loadParkerListing = function (lotNumber, companyId) {

            dataLayerService.getParkerListing(lotNumber, companyId).then(function (response) {
                if (response.data) {
                    // bindModel(response.data);
                    $scope.Parkers = response.data.Details;
                    parkers = response.data.Details;
                    if (response.data.Details.length > 0) {
                        $scope.companyName = response.data.Details[0].CompanyName;
                    }
                }
                else {
                    //Need message center for errors and notifications
                }
            });
        })(lotNumber, companyId);

        $scope.addUserToQueue = function () {

            if ($scope.addUser.$invalid) {
                return false;
            } else {
                var newUser = {
                    'ApplicationQueueId': 0,
                    'LotNumber': lotNumber,
                    'CompanyId': companyId,
                    'FirstName': $scope.NewFirstName,
                    'LastName': $scope.NewLastName,
                    'EmailAddress': $scope.NewEmailAddress,
                    'IsProcessed': 0,
                    'Comments': '',
                    'StartDate': $scope.NewDateEntered,
                    'ProcessedStatus': '',
                    'DateEntered': moment.utc().format('YYYY-MM-DD HH:mm:ss')
                };

                var output = JSON.stringify(newUser);

                dataLayerService.addUserToQueue(newUser).then(function (results) {
                    if (results.data) {
                        $scope.showSuccessAlert = true;

                    } else {
                        $scope.showErrorAlert = true;
                        //Need message center for errors and notifications
                    }
                });                
            }

            return true;
        };
    }
]);

// EditEmployeeController
aceparking.controller('EditEmployeeController', ['$scope', '$rootScope', '$routeParams', '$location'
    , '$window', 'dataLayerService', 'staticDataLayerService', 'commonLib', 'company',
    function ($scope, $rootScope, $routeParams, $location, $window, dataLayerService, staticDataLayerService, commonLib, company) {

        console.log("EditEmployeeController");

        // TODO:  Move common variable declarations to a factory to reduce clutter
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.showEmailAlert = false;
        $scope.isDuplicateStallNumber = false;
        $scope.enableAddButton = true;
        $scope.ShowTerminationDate = false;
        $scope.IsParkerPayTypeBoth = false;

        $scope.ParkerPayTypes = staticDataLayerService.getParkerPayTypes();

        company['LotNumber'] = $window.ln;
        company['EntityId'] = $window.ei;
        company['CompanyId'] = $window.ci;
        company['Username'] = $window.un;
        company['IsPortalAdmin'] = $window.ipa;

        var lotNumber = company['LotNumber'];
        var companyId = company['CompanyId'];
        var parkerId = company['EntityId'];
        var parkers = [];

        console.log('LotNumber:  ' + lotNumber);
        console.log('Company Id:  ' + companyId);
        console.log('Parker Id:  ' + parkerId);
        console.log('Is Portal Admin:  ' + company['IsPortalAdmin']);

        // END - common variable declarations

        $scope.common = commonLib;

        // http://plnkr.co/edit/KRo9X5?p=preview
        ($scope.loadParkerProfile = function (lotNumber, parkerId) {

            dataLayerService.getParkerProfile(lotNumber, parkerId).then(function (response) {
                if (response.data) {
                    bindModel(response.data);
                    console.log('Parkers');
                }
                else {
                    //Need message center for errors and notifications
                }
            });
        })(lotNumber, parkerId);

        $scope.ToggleState = function (booleanValue) {
            $scope.ShowTerminationDate = booleanValue;
        };

        function bindModel(data) {
            $scope.FirstName = data.FirstName;
            $scope.LastName = data.LastName;
            $scope.CardNumber = data.CardNumber;
            $scope.StallNumber = data.StallNumber;
            $scope.Description = data.PayType;
            $scope.ParkerPayType = data.ParkerPayType;

            $scope.CompanyPaid = 0;
        };

        $scope.checkParkerPayType = function () {
            if ($scope.ParkerPayType === 'Both') {
                $scope.IsParkerPayTypeBoth = true;
            } else {
                $scope.IsParkerPayTypeBoth = false;
            }
        }

    }
]);

// ValidationController
aceparking.controller('ValidationsController', ['$scope', '$rootScope', '$routeParams', '$location'
    , '$window', 'dataLayerService', 'staticDataLayerService', 'commonLib', 'company', 'moment',
    function ($scope, $rootScope, $routeParams, $location
        , $window, dataLayerService, staticDataLayerService, commonLib, company, moment) {

        console.log("ValidationsController");
        $rootScope.showPaymentDueController = false;

        // TODO:  Move common variable declarations to a factory to reduce clutter
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.showEmailAlert = false;
        $scope.isDuplicateStallNumber = false;
        $scope.enableAddButton = true;
        $scope.ShowTerminationDate = false;
        $scope.IsParkerPayTypeBoth = false;
        $scope.noValidationsSelected = false;

        $scope.ParkerPayTypes = staticDataLayerService.getParkerPayTypes();

        company['LotNumber'] = $window.ln;
        company['EntityId'] = $window.ei;
        company['CompanyId'] = $window.ci;
        company['Username'] = $window.un;
        company['IsPortalAdmin'] = $window.ipa;

        var lotNumber = company['LotNumber'];
        var companyId = company['CompanyId'];
        var parkerId = company['EntityId'];

        console.log('LotNumber:  ' + lotNumber);
        console.log('Company Id:  ' + companyId);
        console.log('Parker Id:  ' + parkerId);
        console.log('Is Portal Admin:  ' + company['IsPortalAdmin']);

        var isPortalAdmin = company['IsPortalAdmin'] === 'true';

        // END - common variable declarations
        
        // TODO:  This is defined in NotificationType table in AcePark database.  Load data into table 
        // before coming here so I don't have to hard-code numbers
        var validationOrderPlaced = 2;        

        $scope.common = commonLib;

        // http://plnkr.co/edit/KRo9X5?p=preview
        ($scope.loadParkerProfile = function (lotNumber, parkerId, companyId, isPortalAdmin) {

            if (isPortalAdmin) {
                dataLayerService.getCompanyValidations(lotNumber, companyId).then(function (response) {
                    if (response.data) {
                        bindModel(response.data, isPortalAdmin);
                    }
                    else {
                        //Need message center for errors and notifications
                    }
                });
            } else {
                dataLayerService.getParkerValidations(lotNumber, parkerId).then(function (response) {
                    if (response.data) {
                        bindModel(response.data, isPortalAdmin);
                    }
                    else {
                        //Need message center for errors and notifications
                    }
                });
            }
        })(company['LotNumber'], company['EntityId'], company['CompanyId'], company['IsPortalAdmin']);

        $scope.calculateRowTotal = function (lineItem) {
            console.log('Quantity:  ' + lineItem.Quantity);
            console.log('Rate:  ' + lineItem.Rate);
            console.log('Tax;  ' + lineItem.Tax);
            return lineItem.Quantity * (lineItem.Rate + lineItem.Tax);
        }

        $scope.ChangeAmount = function (value, index) {
            console.log('Value is:  ' + value + ' and index is:  ' + index);
            $scope.Validations[index].Amount = $scope.Validations[index].Quantity *
                (parseFloat($scope.Validations[index].Rate) + parseFloat($scope.Validations[index].Tax));

            computeSubTotals();
        }

        $scope.ResetQuantities = function () {
            resetTotals();
            var size = $scope.Validations.length;
            for (var i = 0; i < size; i++) {
                $scope.Validations[i].Quantity = 0;
            }
        }

        $scope.ToggleState = function (booleanValue) {
            $scope.ShowTerminationDate = booleanValue;
        };

        function computeSubTotals() {
            resetTotals();
            var index = 0;
            $scope.Validations.forEach(function (row) {
                if ($scope.Validations[index].Quantity > 0) {

                    var currentQuantity = $scope.Validations[index].Quantity;

                    $scope.RateSubTotal += currentQuantity * parseFloat($scope.Validations[index].Rate);
                    $scope.TaxSubTotal += currentQuantity * parseFloat($scope.Validations[index].Tax);
                    $scope.SubTotal += parseFloat($scope.Validations[index].Amount);
                }
                index++;
            });
        }

        function resetTotals() {
            $scope.RateSubTotal = 0;
            $scope.TaxSubTotal = 0;
            $scope.SubTotal = 0;
        }

        function bindModel(data, isPortalAdmin) {
            var phoneData = data.Phone || '';

            $scope.TodaysDate = moment().format('MM-DD-YYYY');
            $scope.FirstName = data.FirstName;
            $scope.LastName = data.LastName;
            $scope.FullName = data.FullName;
            $scope.CompanyName = isPortalAdmin ? data.CompanyName : data.FullName;
            $scope.Address = data.Address;
            $scope.AddressLine = data.AddressLine;
            $scope.DailyContact = data.DailyContact;
            $scope.Phone = $scope.common.formatPhone(phoneData);
            $scope.Validations = data.Validations;

            var totalLen = data.Validations.length;
            for (var i = 0; i < totalLen; i++) {
                $scope.Validations[i].Amount = $scope.Validations[i].Quantity *
                    (parseFloat($scope.Validations[i].Rate) * parseFloat($scope.Validations[i].Tax));
            }

            $scope.CompanyPaid = 0;
        };

        $scope.checkParkerPayType = function () {
            if ($scope.ParkerPayType === 'Both') {
                $scope.IsParkerPayTypeBoth = true;
            } else {
                $scope.IsParkerPayTypeBoth = false;
            }
        }

        // function to submit the form after all validation has occurred			
        $scope.submitForm = function (isValid) {

            var selectedValidations = $scope.Validations.filter(f => f.Quantity > 0);

            if (selectedValidations.length === 0) {
                isValid = false;
                $scope.noValidationsSelected = true;
            } else {
                isValid = true;
                $scope.noValidationsSelected = false;
            }

            if (isValid) {
                var validationOrder = {};

                var phone = $scope.Phone || '';

                validationOrder.ValidationOrderId = $scope.ValidationOrderId || 0;
                validationOrder.ParkerId = company['EntityId'];
                validationOrder.LotNumber = company['LotNumber'];
                validationOrder.CompanyId = company['CompanyId'];
                validationOrder.FirstName = $scope.FirstName;
                validationOrder.LastName = $scope.LastName;
                validationOrder.FullName = $scope.FullName;
                validationOrder.Phone = phone;
                validationOrder.Address = $scope.Address;
                validationOrder.AddressLine = $scope.AddressLine;
                validationOrder.DailyContact = $scope.DailyContact;
                validationOrder.Username = company['Username'];
                validationOrder.DateEntered = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                validationOrder.Message = $scope.Message;
                validationOrder.Validations = $scope.Validations.filter(f => f.Quantity > 0);

                var validationOutput = JSON.stringify(validationOrder);

                //add Notification
                var parkerNotification = {};

                parkerNotification.ParkerNotificationId = 0;
                parkerNotification.ParkerId = company['EntityId'];
                parkerNotification.NotificationTypeId = 2;
                parkerNotification.NotificationDescription = $scope.FirstName + " " + $scope.LastName + " requested validation(s)";
                parkerNotification.DateEntered = moment.utc().format('YYYY-MM-DD HH:mm:ss');

                var notificationOutput = JSON.stringify(parkerNotification);

                // rename function
                dataLayerService.addNewValidationViaApi(validationOrder).then(function (results) {
                    if (results.data) {
                        $scope.processing = false;
                        $scope.showSuccessAlert = true;
                    } else {
                        $scope.showErrorAlert = true;
                    }
                });

                //add Notification
                dataLayerService.insertNotification(parkerNotification).then(function (results) {
                    if (results.data) {
                        $scope.processing = false;
                        console.log("Notification for ValidationOrder has been added");
                    } else {
                        $scope.showErrorAlert = true;
                    }
                });

            }
        };
    }
]);

// KeycardController
aceparking.controller('KeycardController', ['$scope', '$rootScope', '$routeParams', '$location', '$window',
    'dataLayerService', 'staticDataLayerService', 'commonLib', 'company', 'moment',
    function ($scope, $rootScope, $routeParams, $location, $window
        , dataLayerService, staticDataLayerService, commonLib, company, moment) {

        console.log("KeycardController");

        // TODO:  Move common variable declarations to a factory to reduce clutter
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.showEmailAlert = false;
        $scope.noKeycardsSelected = false;
        $scope.processing = false;
        $scope.numberSelected = -1;

        company['LotNumber'] = $window.ln;
        company['EntityId'] = $window.ei;
        company['CompanyId'] = $window.ci;
        company['Username'] = $window.un;
        company['IsPortalAdmin'] = $window.ipa;

        // TODO:  This is defined in NotificationType table in AcePark database.  Load data into table 
        // before coming here so I don't have to hard-code numbers
        var keycardOrderPlaced = 1;

        //need below to add Notification
        $scope.LotNumber = company['LotNumber'];
        $scope.UserName = company['Username'];

        // END - Move common variable declarations

        $scope.common = commonLib;

        // http://plnkr.co/edit/KRo9X5?p=preview
        ($scope.loadParkerProfile = function(lotNumber, parkerId) {

            dataLayerService.getKeycardData(lotNumber, parkerId).then(function(response) {
                if (response.data) {
                    bindModel(response.data);
                } else {
                    //Need message center for errors and notifications
                }
            });
        })(company['LotNumber'], company['EntityId']);

        $scope.ResetForm = function() {
            resetRates();
            $scope.Description = '';
        }

        function resetRates() {
            $scope.Rate = 0;
            $scope.Tax = 0;
            $scope.Total = 0;
        }

        function bindModel(data) {
            $scope.TodaysDate = moment().format('MM-DD-YYYY');
            $scope.ParkerId = data.ParkerId;
            $scope.FirstName = data.FirstName;
            $scope.LastName = data.LastName;
            $scope.CompanyName = data.CompanyName;
            $scope.KeyCardInformation = data.KeyCardInformation;

            resetRates();
            $scope.Status = data.Status || 'New';
        };

        $scope.adjustKeycardData = function (selectedItem) {

            var keycardInformation = $scope.KeyCardInformation;

            $scope.numberSelected = $scope.KeyCardInformation.indexOf(selectedItem);
            console.log('Index Selected:  ' + $scope.numberSelected);

            if ($scope.ReasonId === undefined) {
                $scope.Rate = 0;
                $scope.Tax = 0;
                $scope.Total = 0;
                $scope.Description = '';
            } else {
            }
            var itemSelected = keycardInformation.find(k => k.KeycardId === $scope.ReasonId);
            if (itemSelected !== 'undefined') {
                $scope.Rate = itemSelected.Rate;
                $scope.Tax = itemSelected.Tax;
                $scope.Total = itemSelected.Rate + itemSelected.Tax;
                $scope.Description = itemSelected.Description;
            }
        };

        // function to submit the form after all validation has occurred			
        $scope.submitForm = function (isValid) {

            if (isValid) {
                $scope.processing = true;
                var keycardOrder = {};

                keycardOrder.KeycardOrderId = $scope.KeycardId || 0;
                keycardOrder.ParkerId = company['EntityId'];
                keycardOrder.Description = $scope.Description;
                keycardOrder.ReasonId = $scope.ReasonId;
                keycardOrder.Rate = $scope.Rate;
                keycardOrder.Tax = $scope.Tax;
                keycardOrder.Total = $scope.Total;
                keycardOrder.Message = $scope.KeycardMessage;
                keycardOrder.OrderDate = moment.utc().format('YYYY-MM-DD HH:mm:ss'),
                keycardOrder.Status = $scope.Status;
                keycardOrder.Paid = false;
                keycardOrder.ProcessedBy = "";

                var keycardOrderOutput = JSON.stringify(keycardOrder);

                //add Notification
                var parkerNotification = {};

                parkerNotification.ParkerNotificationId = 0;
                parkerNotification.ParkerId = company['EntityId'];
                parkerNotification.NotificationTypeId = 1;
                parkerNotification.NotificationDescription = $scope.FirstName + " " + $scope.LastName + " requested keycard(s)";
                parkerNotification.DateEntered = moment.utc().format('YYYY-MM-DD HH:mm:ss');

                var notificationOutput = JSON.stringify(parkerNotification);

                dataLayerService.addNewKeycardViaApi(keycardOrder).then(function (results) {
                    if (results.data) {
                        var companyProfileResults = results.data;
                        $scope.processing = false;
                        $scope.showSuccessAlert = true;
                        // $scope.common.redirect('/paybalancedueform/K/' + results.data.Payload);
                    } else {
                        $scope.processing = false;
                        $scope.showErrorAlert = true;
                    }
                });

                //add Notification
                dataLayerService.insertNotification(parkerNotification).then(function (results) {
                    if (results.data) {
                        //$scope.processing = false;
                        console.log("Notification for KeycardOrder has been added");
                    } else {
                        $scope.showErrorAlert = true;
                    }
                });
            }
        };
    }
]);

// PaymentDueController
aceparking.controller('PaymentDueController', ['$scope', '$rootScope', '$routeParams', '$location', '$window',
    'dataLayerService', 'staticDataLayerService', 'commonLib', 'company', 'moment', 'numeral',
    function ($scope, $rootScope, $routeParams, $location, $window
        , dataLayerService, staticDataLayerService, commonLib, company, moment, numeral) {

        // TODO:  Move common variable declarations to a factory to reduce clutter
        console.log('PaymentDueController');

        $scope.hideSubmitButton = false;
        $scope.AmountDue = 0;
        $scope.isValidExpiration = false;
        $scope.dataSet = false;
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.showEmailAlert = false;
        $scope.processing = false;
        $scope.Balances = [];
        $scope.itemInvoice = 'All';         // Pay all invoices
        $scope.showMany = false;            // if true, then more than one invoice has balance > 0

        company['LotNumber'] = $window.ln;
        company['EntityId'] = $window.ei;
        company['CompanyId'] = $window.ci;
        company['Username'] = $window.un;
        company['IsPortalAdmin'] = $window.ipa;

        $scope.ParkerId = company['EntityId'];

        // var firstOfMonth = moment([moment().year(), moment().month(), 1]);
        var debug = true;
        // END - common variable declarations

        var d = new Date();
        var firstOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);

        $scope.CreditCardTypes = staticDataLayerService.getCreditCardTypes();
        $scope.Months = staticDataLayerService.getMonths();
        $scope.Years = staticDataLayerService.getExpirationYears();

        $scope.common = commonLib;

        // http://plnkr.co/edit/KRo9X5?p=preview
        ($scope.loadBalances = function (lotNumber, parkerId) {

            dataLayerService.getOutstandingBalances(lotNumber, parkerId).then(function (response) {
                if (response.data) {
                    bindModel(response.data);
                } else {
                    //Need message center for errors and notifications
                }
            });
        })(company['LotNumber'], company['EntityId']);

        $scope.ResetForm = function () {
            $scope.CreditCardName = '';
            $scope.CreditCardType = '';
            $scope.CreditCardNumber = '';
            $scope.CreditCardMonth = '';
            $scope.CreditCardYear = '';
            $scope.CVV = '';
            $scope.AmountDue = '';
        }

        $scope.onMonthChanged = function () {

            if ($scope.CreditCardMonth === undefined) {
                $scope.dateSet = true;
                $scope.isValidExpiration = false;
            } else {
                var expMonth = parseInt($scope.CreditCardMonth) - 1;
                var expYear = parseInt($scope.CreditCardYear);

                var dateSelected = new Date(expYear, expMonth, 1);

                $scope.dateSet = true;
                $scope.isValidExpiration = firstOfMonth <= dateSelected;

                if (debug) console.log('DateSet:  ' + $scope.dateSet);
                if (debug) console.log('isValidExpiration:  ' + $scope.isValidExpiration);
            }
        };

        $scope.onYearChanged = function () {

            if ($scope.CreditCardYear === undefined) {
                $scope.dateSet = true;
                $scope.isValidExpiration = false;
            } else {
                var expMonth = parseInt($scope.CreditCardMonth) - 1;
                var expYear = parseInt($scope.CreditCardYear);

                var dateSelected = new Date(expYear, expMonth, 1);

                $scope.dateSet = true;
                $scope.isValidExpiration = firstOfMonth <= dateSelected;

                if (debug) console.log('DateSet:  ' + $scope.dateSet);
                if (debug) console.log('isValidExpiration:  ' + $scope.isValidExpiration);
            }
        };

        $scope.selectInvoice = function (invoiceNumber, invoiceAmount) {

            if (invoiceAmount === undefined) {
                invoiceAmount = $scope.globalBalance;
                $scope.itemInvoice = 'All';
            }

            $scope.AmountDue = invoiceAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            $scope.InvoiceNumber = invoiceNumber;
            $scope.PaymentPerInvoice = invoiceAmount;
        };

        function bindModel(data) {
            $scope.TodaysDate = moment().format('MM-DD-YYYY');
            $scope.ParkerId = data.ParkerId;
            $scope.LotLocation = data.LotLocation;
            $scope.FullName = data.FullName;
            $scope.Paid = data.Paid;
            $scope.EmailAddress = data.EmailAddress;

            $scope.showMany = data.InvoiceBalances.length > 1;
            $scope.InvoiceBalances = data.InvoiceBalances;
            $scope.Balances = data.InvoiceBalances.map(f => {
                return {
                    'InvoiceNumber': f.InvoiceNumber,
                    'Balance': numeral(f.Balance).format('$0,0.00'),
                    'Display': f.InvoiceNumber + ' - ' + numeral(f.Balance).format('$0,0.00')
                };
            });

            // var invoiceSum = data.InvoiceBalances.reduce(function (a, b) { return { Total: a.Balance + b.Balance }; });
            $scope.globalBalance = data.AmountDue;
            $scope.AmountDue = data.AmountDue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

            $scope.hideSubmitButton = data.AmountDue === 0;
        };

        $scope.isPastMonthYear = function(theMonth, theYear) {
            var firstOfMonth = moment([moment().year(), moment().month(), 1]);
            var selectedMonthYear = moment([theYear, theMonth, 1]);

            console.log('Is Past Month Year:  ' + selectedMonthYear.isBefore(firstOfMonth));

            return selectedMonthYear.isBefore(firstOfMonth);
        }

        // function to submit the form after all validation has occurred			
        $scope.submitForm = function (isValid) {
            $scope.processing = true;

            var invoices = [];
            var itemInvoice = $scope.itemInvoice;

            if (itemInvoice === 'All') {
                for (var j = 0, max = $scope.InvoiceBalances.length; j < max; j++) {
                    invoices.push({
                        'PurchaseInvoiceId': 0,
                        'PurchaseId': 0,
                        'InvoiceNumber': $scope.InvoiceBalances[j]['InvoiceNumber'],
                        'Amount': $scope.InvoiceBalances[j]['Balance'],
                        'DateEntered': moment.utc().format('YYYY-MM-DD HH:mm:ss')
                    });
                };
            } else {

                var invoiceData = (itemInvoice === undefined) 
                    ? $scope.InvoiceBalances[0] : itemInvoice;

                invoices.push({
                    'PurchaseInvoiceId': 0,
                    'PurchaseId': 0,
                    'InvoiceNumber': invoiceData.InvoiceNumber,
                    'Amount': numeral().unformat(invoiceData.Balance),
                    'DateEntered': moment.utc().format('YYYY-MM-DD HH:mm:ss')
                });
            }

            if (isValid) {

                // $scope.processing = true;
                //var creditCard = {};
                //var oneTimePaymentTransaction = {};
                //$scope.AmountDue = $scope.AmountDue.replace('$', '');
                //$scope.AmountDue = $scope.AmountDue.replace(/,/g, '');

                //var creditCardYear = $scope.CreditCardYear.toString();
                //var twoDigitYear = creditCardYear.substr(2, 2);

                //creditCard = {
                //    type: $scope.CreditCardType,
                //    cardholder_name: $scope.CreditCardName,
                //    card_number: $scope.CreditCardNumber.replace(/ /g, ''),
                //    exp_date: $scope.CreditCardMonth + twoDigitYear,
                //    cvv: $scope.CVV
                //};

                //oneTimePaymentTransaction = {
                //    merchant_ref: "string",
                //    transaction_type: "authorize",
                //    method: "credit_card",
                //    amount: (parseFloat($scope.AmountDue) * 100).toString(),
                //    partial_redemption: "",
                //    currency_code: "USD",
                //    credit_card: creditCard
                //};

                //var outgoing = JSON.stringify(oneTimePaymentTransaction);

                //dataLayerService.postPayment(oneTimePaymentTransaction).then(function (results) {
                //    if (results.data) {

                //        var ccNumber = $scope.CreditCardNumber.replace(/ /g, '');

                //        var purchase = {
                //            'PurchaseId': 0,
                //            'TransactionId': results.data.transaction_id,
                //            'BankMessage': results.data.bank_message,
                //            'ValidationStatus': results.data.validation_status,
                //            'TransactionStatus': results.data.transaction_status,
                //            'TransactionType': results.data.transaction_type,
                //            'CreditCardNumber': ccNumber.substr(12),
                //            'DateEntered': moment.utc().format('YYYY-MM-DD HH:mm:ss'),
                //            'PurchaseInvoices': invoices,
                //            'EntityId': company['EntityId']
                //        }

                //        var t = purchase;
                //        var outgoing = JSON.stringify(purchase);
                //        var outgoingInvoices = JSON.stringify(invoices);

                //        return dataLayerService.postPurchase(purchase);
                //    } else {
                //        // error handling and messaging go here
                //        $scope.showErrorAlert = true;
                //    }
                //}).then(function (results) {
                //    if (results.data) {
                //        $scope.processing = false;
                //        $scope.showSuccessAlert = true;
                //    } else {
                //        $scope.processing = false;
                //        // error handling and messaging go here
                //        $scope.showErrorAlert = true;
                //    }
                //});

                // if the customer opts for recurring, then get the token
                if ($scope.recurring) {

                    var payeezy = {};
                    var parkerData = {};
                    var sanitized = $scope.CreditCardNumber.replace(/ /g, '');

                    payeezy = {
                        card_type: $scope.CreditCardType,
                        cardholder_name: $scope.CreditCardName,
                        cc_number: sanitized,
                        country: 'US',
                        cvv_code: $scope.CVV,
                        email: $scope.EmailAddress,
                        exp_month: $scope.CreditCardMonth,
                        exp_year: $scope.CreditCardYear,
                        type: "mobile"
                    }


                    parkerData = {
                        ParkerId: $scope.ParkerId,
                        Password: '',
                        CreditCardType: $scope.CreditCardType,
                        CreditCardName: $scope.CreditCardName,
                        CreditCardExpiration: $scope.CreditCardMonth + $scope.CreditCardYear.toString().substr(2, 2),
                        Digits: $scope.CreditCardNumber.substr($scope.CreditCardNumber.length - 4, 4),
                        Token: '',
                        DateEntered: moment.utc().format('YYYY-MM-DD HH:mm:ss')
                    };

                    

                    var getTokenPromise = dataLayerService.getTokenViaApi(payeezy);
                    var insertDataPromise = getTokenPromise.then(function(results) {
                        parkerData.Token = results.data.Token;
                        return dataLayerService.UpdateParkerData(parkerData);
                    });

                    $q.all([getTokenPromise, insertDataPromise]).then(function (results) {
                        $scope.processing = false;
                        if (results.data) {
                            $scope.showSuccessAlert = true;
                        } else {
                            $scope.showErrorAlert = true;
                        }
                    });
                }
            }
        };
    }
]);

aceparking.controller('UpdateParkerController'
    , ['$scope', '$location', 'staticDataLayerService', 'dataLayerService', '$window', 'commonLib', 'moment', 'user',

    function ($scope, $location, staticDataLayerService, dataLayerService, $window, commonLib, moment, user) {
        console.log("Update Parker Controller ");

        user['LotNumber'] = $window.ln;
        user['ParkerId'] = $window.ei;

        $scope.newUser = {};
        $scope.hasBeenUpdated = false;
        $scope.showErrorAlert = false;
        $scope.common = commonLib;
        $scope.matchEmailAddress = new RegExp("^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$");

        dataLayerService.getParkerUpdate(user['LotNumber'], user['ParkerId']).then(function (response) {
            if (response.data) {
                bindModel(response.data);
            } else {
                //Need message center for errors and notifications
            }
        });

        // $scope.allStates = staticDataLayerService.getStates();

        function bindModel(data) {
            $scope.TodaysDate = moment().format('MM-DD-YYYY');
            $scope.ParkerId = data.ParkerId;

            var phone = data.Phone || '';
            if (phone.length > 0) phone = $scope.common.formatPhone(phone);

            $scope.newUser.FirstName = data.FirstName;
            $scope.newUser.LastName = data.LastName;
            $scope.newUser.Address = data.Address;
            $scope.newUser.EmailAddress = data.EmailAddress;
            $scope.newUser.Phone = phone;
            $scope.newUser.StartDate = moment(data.StartDate).format('MM-DD-YYYY');
            $scope.newUser.City = data.City;
            $scope.newUser.State = data.State;
            $scope.newUser.ZipCode = data.ZipCode;

            var chosenValue = $scope.states.find(f => f.value === data.State);
            angular.forEach($scope.states, function(item) {
                if (angular.equals(chosenValue, item))
                    $scope.newUser.State = item;
            });
        };


        //Save new customer/Update existing one
        $scope.submitForm = function (data) {

            if (data) {
                var phone = $scope.newUser.Phone || '';
                if (phone.length > 0) phone = phone.replace(/-/g, '');

                var parker = {
                    ParkerId: user['ParkerId'],
                    FirstName: $scope.newUser.FirstName,
                    LastName: $scope.newUser.LastName,
                    EmailAddress: $scope.newUser.EmailAddress,
                    Address: $scope.newUser.Address,
                    City: $scope.newUser.City,
                    State: $scope.newUser.State,
                    ZipCode: $scope.newUser.ZipCode,
                    Phone: phone
                };

                var output = JSON.stringify(parker);      

                dataLayerService.updateParker(parker).then(function (response) {
                    if (response.data) {
                        $scope.hasBeenUpdated = true;
                    } else {
                        //Need message center for errors and notifications
                        $scope.showErrorAlert = true;
                    }
                });
            }
        };
    }
]);