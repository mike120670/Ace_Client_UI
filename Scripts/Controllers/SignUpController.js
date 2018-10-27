aceparking.controller('SignUpController', [
    '$scope', '$location', '$q',
    'dialogBoxService', 'staticDataLayerService', 'dataLayerService', '$window', 'moment', 'commonLib',
    function ($scope, $location, $q, dialogBoxService, staticDataLayerService, dataLayerService, $window, moment, commonLib) {

        console.log('SignUp Controller');

        var lotNumber = $location.search()['lot'];
        var parkingRateId = $location.search()['rate'];
        var redirect = true;
        var debug = true;

        // Moment is injected and is working here, but not where I need it to be
        // var firstOfMonth = moment([moment().year(), moment().month(), 1]).format("MM-DD-YYYY");
        // console.log('firstOfMonth:  ' + firstOfMonth);
        var d = new Date();
        var firstOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);

        $scope.loading = false;
        $scope.CreditCardTypes = staticDataLayerService.getCreditCardTypes();
        $scope.Months = staticDataLayerService.getMonths();
        $scope.Years = staticDataLayerService.getExpirationYears();
        $scope.states = staticDataLayerService.getStates();
        $scope.nextDates = staticDataLayerService.getNextDates();
        $scope.newUser = {};
        $scope.dateSet = false;
        $scope.isValidExpiration = false;
        $scope.common = commonLib;
        $scope.modalShown = false;
        $scope.toggleModal = function() {
            $scope.modalShown = !$scope.modalShown;
        };

        $scope.lotRates = [];
        ($scope.getRates = function(lotNumber) {

            dataLayerService.getLotRateSearch(lotNumber)
                .then(function(result) {

                    $scope.lotRates = result.data.Details.map(d => {
                        return {
                            'ParkingRateId': d.ParkingRateId,
                            'Description': d.Description +
                                ' - ' +
                                d.Amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                        }
                    });

                    $scope.User.ParkingRateId = parseInt(parkingRateId);
                    return result.data.Details;
                });
        })(lotNumber);

        if ($scope.User === null) {
            if (debug) console.log('$scope.User is null');
        } else if ($scope.User === undefined) {
            if (debug) console.log('$scope.User is undefined');
            $scope.User = {};

        } else {
            if (debug) console.log('$scope.User is not null');            
        }

        var onDataLoaded = function (result) {

            if (redirect) {
                var newURL = $location.path('/');
                $window.location.href = newURL.$$absUrl;
            }

            if (!result) {
                // Discard incoming data.
            }
        };

        $scope.replicateName = function () {
            $scope.User.CreditCardFirstName = $scope.User.FirstName;
            $scope.User.CreditCardLastName = $scope.User.LastName;
        };

        $scope.onYearChanged = function () {

            if ($scope.User.CreditCardYear === undefined) {
                $scope.dateSet = true;
                $scope.isValidExpiration = false;
            } else {
                var expMonth = parseInt($scope.User.CreditCardMonth) - 1;
                var expYear = parseInt($scope.User.CreditCardYear);

                var dateSelected = new Date(expYear, expMonth, 1);

                $scope.dateSet = true;
                $scope.isValidExpiration = firstOfMonth < dateSelected;

                if (debug) console.log('DateSet:  ' + $scope.dateSet);
                if (debug) console.log('isValidExpiration:  ' + $scope.isValidExpiration);
            }
        };

        // function to submit the form after all validation has occurred			
        $scope.submitForm = function (isValid) {

            if (isValid) {
                var payeezy = {};
                var customer = {};
                customer.CustomerLots = [];
                customer.CustomerParkings = [];
                customer.Accounts = [];
                var vehicles = [];
                var sanitized = $scope.User.CreditCardNumber.replace(/ /g, '');
                if (debug) console.log('sanitized:  ' + sanitized);

                payeezy = {
                    card_type: $scope.User.CreditCardType,
                    cardholder_name: $scope.User.CreditCardFirstName + ' ' + $scope.User.CreditCardLastName,
                    cc_number: sanitized,
                    city: $scope.User.City,
                    country: 'US',
                    cvv_code: $scope.User.CreditCardCode,
                    email: $scope.User.EmailAddress,
                    exp_month: $scope.User.CreditCardMonth,
                    exp_year: $scope.User.CreditCardYear,
                    phone_number: $scope.User.Phone.replace(/-/g, ''),
                    state_province: $scope.User.State,
                    street: $scope.User.Address,
                    type: "mobile",
                    zip_postal_code: $scope.User.ZipCode                    
                }

                customer.CustomerId = 0;
                customer.FirstName = $scope.User.FirstName;
                customer.LastName = $scope.User.LastName;
                customer.EmailAddress = $scope.User.EmailAddress;
                customer.Password = $scope.User.Password;
                customer.DateEntered = moment.utc().format();
                customer.Address = $scope.User.Address;
                customer.City = $scope.User.City;
                customer.State = $scope.User.State;
                customer.ZipCode = $scope.User.ZipCode;
                customer.Phone = $scope.common.cleanPhone($scope.User.Phone),
                customer.StartDate = $scope.User.StartDate;
                customer.Comments = $scope.User.Comments || ' ';
                customer.CreditCardLastName = $scope.User.FirstName + ' ' + $scope.User.CreditCardLastName;
                customer.CreditCardType = $scope.User.CreditCardType;
                customer.CreditCardExpiration = $scope.User.CreditCardMonth + $scope.common.getTwoDigitYear($scope.User.CreditCardYear);
                customer.Digits = sanitized.substr(sanitized.length - 4);
                customer.IsRecurring = $scope.User.Recurring;
                customer.Token = '';


                var d = $scope.User.CreditCardNumber;
                customer.Digits = $scope.common.isNullOrEmpty(d) ? '' : d.substr(d.length - 4);

                vehicles.push({
                    'License': $scope.User.License1,
                    'IssuingState': $scope.User.IssuingState1,
                    'Make': $scope.User.Make1,
                    'IsActive': true,
                    'DateEntered': moment.utc().format('YYYY-MM-DD HH:mm:ss')
                });

                if ($scope.User.License2 !== undefined) {
                    vehicles.push({
                        'License': $scope.User.License2,
                        'IssuingState': $scope.User.IssuingState2,
                        'Make': $scope.User.Make2,
                        'IsActive': true,
                        'DateEntered': moment.utc().format('YYYY-MM-DD HH:mm:ss')
                    });
                }
                customer.Vehicles = vehicles;
                customer.Accounts.push({ 'Balance': 0 });
                customer.CustomerLots.push({ 'LotNumber': $scope.User.LotNumber });
                customer.CustomerParkings.push({
                    'ParkingRateId': $scope.User.ParkingRateId,
                    'DateEntered': moment.utc().format('YYYY-MM-DD HH:mm:ss')
                });
                
                var output = JSON.stringify(payeezy);

                $scope.loading = true;
                var getTokenPromise = dataLayerService.getTokenViaApi(payeezy);

                var insertDataPromise = getTokenPromise.then(function (results) {
                    customer.Token = results.data.Token;

                    if ($scope.common.isNullOrEmpty(customer.Token) || customer.Token === undefined) {
                        
                        customer.CreditCardLastName = '';
                        customer.CreditCardType = '';
                        customer.CreditCardExpiration = '';
                        customer.Digits = '';
                        customer.IsRecurring = false;
                    }
                    return dataLayerService.addCustomerViaApi(customer);
                });


                $q.all([getTokenPromise, insertDataPromise]).then(function (results) {
                    $scope.loading = false;
                    dialogBoxService.show(dialogBoxService.dialogType.alert,
                        'Sign Up Process Completed',
                        'You will receive an email confirmation shortly.<br /><br />You will be redirected when this closes.', "",
                        onDataLoaded);
                });
            }
        };
    }
]);

// dialogBoxService
aceparking.factory('dialogBoxService', [function () {
    var dialogType = { alert: 1, confirm: 2, prompt: 3, custom: 999 };
    var show = function (type, title, message, footer, callback) {
        var options = {
            title: title,
            message: message
        };
        switch (type) {
            case dialogType.confirm:
                options.buttons = {
                    cancel: {
                        label: "Cancel",
                        className: "btn-default",
                        callback: function (result) {
                            callback(false);
                        }
                    },
                    main: {
                        label: "OK",
                        className: "btn-primary",
                        callback: function (result) {
                            callback(true);
                        }
                    }
                };
                break;
            case dialogType.alert:
                options.buttons = {
                    main: {
                        label: "OK",
                        className: "btn-primary",
                        callback: function (result) {
                            callback(true);
                        }
                    }
                };
                break;
            default:
                options.buttons = {
                    main: {
                        label: "OK",
                        className: "btn-primary"
                    }
                };
                break;
        }
        bootbox.dialog(options);
    };
    return {
        dialogType: dialogType,
        show: show
    };
}]);

