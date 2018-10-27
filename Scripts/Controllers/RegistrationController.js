aceparking.controller('RegistrationController', ['$scope', '$location', 'staticDataLayerService', 'dataLayerService', '$window', 'moment', 'user',
    // https: //eslint.org/docs/rules/eqeqeq
    function ($scope, $location, staticDataLayerService, dataLayerService, $window, moment, user) {
        console.log("Registration Controller");

        user['LotNumber'] = $window.ln;
        user['CustomerId'] = $window.ci;

        var lotNumber = user['LotNumber'];
        var customerId = user['CustomerId'];
        var tempData = {};

        $scope.errorMessage = '';
        var showErrorMessage = false;

        //When successefully created reset to true
        //dataLayerService.putCreateAccount($scope.customerToCreateOBJ)
        $scope.cutomerObjCreated = false;
        $scope.scopeToken = "1111";
        //$scope.newCustomerId = "0";

        $scope.myFormStatus = "Validating ...";
        $scope.tempVehicle2_License = "";

        /////Begin: Select(s), Drop Down Menu(s) section

        $scope.states = staticDataLayerService.getStates();

        $scope.months = staticDataLayerService.getMonths();

        $scope.CreditCardTypes = staticDataLayerService.getCreditCardTypes();

        $scope.ExpirationYear = staticDataLayerService.getExpirationYears();

        //StartDate, only 01 and 15 of the NEXT month
        $scope.nextDates = staticDataLayerService.getNextDates();
        //
        $scope.MakeAllCars = staticDataLayerService.getCars();
        var baseRateObj = {};
        $scope.listBaseRateObj = [];

        //all indexes must be -1 when in production!!!
        var isTesting = true;
        $scope.Index = isTesting ? 1 : -1;

        //initialize all indexes
        $scope.stateAddressIndex = $scope.Index;
        $scope.StateVehicle1Index = $scope.Index;
        $scope.StateVehicle2Index = -1;
        $scope.MonthIndex = $scope.Index;
        $scope.ExpYearIndex = $scope.Index;
        $scope.CreditCardTypeIndex = $scope.Index;
        //
        $scope.MakeVehicle1Index = $scope.Index;
        $scope.MakeVehicle2Index = -1;
        //
        $scope.BaseRatesIndex = $scope.Index;
        //nextDates[defaultIndex]"
        $scope.defaultIndex = $scope.Index;
        //show <select name="StartDate" and hide   <input type="date
        $scope.StartDateReadonly = false;
        $scope.itemAddr = $scope.states;
        $scope.itemStateVehicle1 = $scope.states;
        $scope.itemStateVehicle2 = $scope.states;
        $scope.itemMonth = $scope.months;
        $scope.itemExpYear = $scope.ExpirationYear;
        $scope.itemCreditCardType = $scope.CreditCardTypes;
        //
        $scope.itemMakeVehicle1 = $scope.MakeAllCars;
        $scope.itemMakeVehicle2 = $scope.MakeAllCars;
        //
        $scope.itemBaseRate = $scope.listBaseRateObj;
        //nextDates[defaultIndex]"
        $scope.itemNextDates = $scope.nextDates;

        $scope.selectMonth = function () {

            $scope.MonthInPast = $scope.itemMonth.value < moment().format('MM') &&
                $scope.Month[0].value === $scope.itemMonth.value;
        };

        $scope.selectYEAR = function () {
            $scope.YearInPast = $scope.itemMonth.value < moment().format('YY') &&
                $scope.ExpirationYear[0].value === $scope.itemExpYear.value;
        };
        
        $scope.selectCreditCardType = function (CreditCardType) {
            $scope.message = 'Credit Card Type Selected: ' + $scope.itemCreditCardType.name + ' , ' + $scope.itemCreditCardType.value;
        };


        $scope.selectMakeVehicle = function (Make) {
            if (Make === 0) {
                $scope.message = 'Make Vehicle 1 Selected: ' + $scope.itemMakeVehicle1.name + ' , ' + $scope.itemMakeVehicle1.value;

            } else {
                $scope.message = 'Make Vehicle 2 Selected: ' + $scope.itemMakeVehicle2.name + ' , ' + $scope.itemMakeVehicle2.value;
            }

        };

        ///////END: Select(s), Drop Down Menu(s) section
        //email address
        $scope.customerId.emailAddress = $scope.emailAddress;
        // saveCustomerProfile
        $scope.saveCustomerProfile = function (data) {

            dataLayerService.saveCustomerProfile(lotNumber, customerId)
                .then(
                function (results) {
                    //data.
                    if (results.data) {

                        // tempData definition moved to top.
                        tempData = results.data;
                        $scope.getCustomerByIdOBJ = results.data;

                        //must Enable Save button
                        tempData.Password = -1;
                        $scope.getCustomerByIdOBJ.Password = -1;

                        //
                        if (tempData.Vehicles[1] !== null) {
                            $scope.tempVehicle2_License = tempData.Vehicles[1].License;
                        }
                        //https://stackoverflow.com/questions/5717126/var-or-no-var-in-javascripts-for-in-loop
                        //get indexes for all Select(s)
                        //Set selected items for itemAddr, itemStateVehicle1, itemStateVehicle2
                        for (i = 0; i <= $scope.states.length - 1; i++) {
                            //Address
                            if ($scope.states[i].value === tempData.State) {
                                $scope.stateAddressIndex = i;
                            }
                            //Vehicle1
                            if (tempData.Vehicles[0] !== null &&
                                $scope.states[i].value === tempData.Vehicles[0].IssuingState) {
                                $scope.StateVehicle1Index = i;
                            }
                            //Vehicle2
                            if (tempData.Vehicles[1] !== null &&
                                $scope.states[i].value === tempData.Vehicles[1].IssuingState) {
                                $scope.StateVehicle2Index = i;
                            }
                        }

                        //StartDate, $scope.itemNextDates = $scope.nextDates;
                        for (i = 0; i < $scope.nextDates.length; i++) {
                            if ($scope.nextDates[i].value ===
                                kendo.toString(kendo.parseDate(tempData.StartDate), 'MM-dd-yyyy')) {
                                $scope.defaultIndex = i;
                            }
                        }


                        //Credit Card  ExpirationYear
                        for (i = 0; i <= $scope.ExpirationYear.length - 1; i++) {
                            if ($scope.ExpirationYear[i].value === tempData.ExpirationYear) {
                                $scope.ExpYearIndex = i;
                            }
                        }

                        //MakeAllCars
                        for (i = 0; i <= $scope.MakeAllCars.length - 1; i++) {
                            if ($scope.MakeAllCars[i].value === tempData.Vehicles[0].Make) {
                                $scope.MakeVehicle1Index = i;
                            }
                            //
                            if (tempData.Vehicles[1] !== null) {
                                if ($scope.MakeAllCars[i].value === tempData.Vehicles[1].Make) {
                                    $scope.MakeVehicle2Index = i;
                                }
                            }
                        }// end MakeAllCars

                        tempData.StartDate = moment(tempData.StartDate).format('MM-DD-YYYY');
                        $scope.newUser = tempData ? tempData : {};
                        
                        $scope.StartDateReadonly = true;

                        $scope.sizeDDStates = 6;

                        //reset below from DB, according to indexes
                        $scope.itemAddr = $scope.states[$scope.stateAddressIndex];
                        //StartDate
                        $scope.itemNextDates = $scope.nextDates[$scope.defaultIndex];
                        //states vehicles 
                        $scope.itemStateVehicle1 = $scope.states[$scope.StateVehicle1Index];
                        $scope.itemStateVehicle2 = $scope.states[$scope.StateVehicle2Index];
                        //credit card
                        $scope.itemMonth = $scope.months[$scope.MonthIndex];
                        $scope.itemExpYear = $scope.ExpirationYear[$scope.ExpYearIndex];
                        $scope.itemCreditCardType = $scope.CreditCardTypes[$scope.CreditCardTypeIndex];
                        //make vehicles
                        $scope.itemMakeVehicle1 = $scope.MakeAllCars[$scope.MakeVehicle1Index];
                        $scope.itemMakeVehicle2 = $scope.MakeAllCars[$scope.MakeVehicle2Index];

                        //return dataLayerService.getCustomerParkings(lotNumber, customerId);
                        var response = results.data.ParkingRates;
                        for (i = 0; i < response.length; i++) {
                            baseRateObj = {
                                BaseRateId: response[i].BaseRateId,
                                LotNumber: response[i].LotNumber,
                                Description: response[i].Description,
                                Amount: response[i].Amount
                            };
                            $scope.listBaseRateObj.push(baseRateObj);
                        }

                        // This was originally in dataLayerService.getListBaseRateObj(lotNumber)
                        //BaseRate, parking rate
                        $scope.getBaseRateId = -1;
                        for (i = 0; i < $scope.getCustomerByIdOBJ.ParkingRates.length; i++) {
                            if ($scope.getCustomerByIdOBJ.ParkingRates[i].ParkingRateId === $scope.getCustomerByIdOBJ.ParkingRateId) {
                                $scope.getBaseRateId = $scope.getCustomerByIdOBJ.ParkingRates[i].BaseRateId;
                            }
                        }

                        for (i = 0; i <= $scope.listBaseRateObj.length - 1; i++) {
                            if ($scope.getCustomerByIdOBJ.ParkingRateId !== null) {
                                if ($scope.listBaseRateObj[i].BaseRateId === $scope.getBaseRateId) {
                                    $scope.BaseRatesIndex = i;
                                    $scope.itemBaseRate = $scope.listBaseRateObj[$scope.BaseRatesIndex];
                                } //  listBaseRateObj
                            }// end getCustomerByIdOBJ
                        }
                        $scope.itemBaseRate = $scope.listBaseRateObj[$scope.BaseRatesIndex];
                    } //if (results.data)
                } // end dataLayerService.saveCustomerProfile  
              );
        }; // end $scope.saveCustomerProfile  


        if ($location.$$absUrl.indexOf('?') > 0) {

            $scope.saveCustomerProfile(lotNumber, customerId);
        }

        $scope.onBlurSubmit = function () {
            $scope.hasBeenUpdated = false;

        };

        //call when update customer ONLY
        //Update $scope.newUser with values From SelectS;
        function UpdateFromSelects() {
            //address
            $scope.newUser.State = $scope.itemAddr.value;
            //StartDate
            $scope.newUser.StartDate = $scope.itemNextDates.value;
            //Credit card
            $scope.newUser.CreditCardType = $scope.itemCreditCardType === null ? "" : $scope.itemCreditCardType.value;
            $scope.newUser.ExpirationYear = $scope.itemExpYear === null ? "" : $scope.itemExpYear.value;

            //Vehicles[0] always exists, check the Vehicles[1]
            $scope.newUser.Vehicles[0].IssuingState = $scope.itemStateVehicle1.value;
            $scope.newUser.Vehicles[0].Make = $scope.itemMakeVehicle1.value;
            //1-st vehicle MUST BE IsActive = true
            $scope.newUser.Vehicles[0].IsActive = true;

            if ($scope.newUser.Vehicles[1] !== null) {

                //2-nd vehicle gets removed, so reset IsActive to false, 
                if ($scope.newUser.Vehicles[1].License === "" && $scope.itemStateVehicle2 === null && $scope.itemMakeVehicle2 === null) {
                    $scope.newUser.Vehicles[1].IsActive = false;
                } else {
                    $scope.newUser.Vehicles[1].CustomerId = $scope.newUser.Vehicles[0].CustomerId;
                    $scope.newUser.Vehicles[1].IssuingState = $scope.itemStateVehicle2.value;
                    $scope.newUser.Vehicles[1].Make = $scope.itemMakeVehicle2.value;
                    $scope.newUser.Vehicles[1].DateEntered = $scope.newUser.Vehicles[1].DateEntered !== null ? $scope.newUser.Vehicles[1].DateEntered : moment.utc().format('YYYY-MM-DD HH:mm:ss');
                    $scope.newUser.Vehicles[1].IsActive = true;
                }
            }

            //CustomerParkings/ParkingRates
            $scope.newUser.BaseRateId = $scope.itemBaseRate.BaseRateId;

        }

        //Save customer profile
        $scope.saveEdit = function (data) {

            dataLayerService.saveCustomerProfile(lotNumber, customerId)
                .then(
                function (results) {

                    if (results.data) {
                        $scope.vehicleId_SecondVehicle = 0;
                        if (results.data.Vehicles.length === 2) {
                            $scope.vehicleId_SecondVehicle = results.data.Vehicles[1].VehicleId;
                            $scope.tempVehicle2_License = results.data.Vehicles[1].License;
                        }

                        ///////////
                        ////The 1-st vehicle is hard coded, the 2-nd Vehicle is added dynamically
                        var customerObj = {
                            CustomerId: customerId,
                            firstName: data.FirstName,
                            lastName: data.LastName,
                            emailAddress: data.EmailAddress,
                            address: data.Address,
                            city: data.City,
                            state: $scope.itemAddr.value,
                            //
                            zipCode: data.ZipCode,
                            phone: data.Phone,
                            //
                            //startDate: kendoDatePicker,
                            startDate: $scope.itemNextDates.value,
                            //dateEntered
                            dateEntered: moment().utc,
                            //Not Required/
                            comments: data.Comments,
                            password: data.Password,
                            creditCardType: $scope.itemCreditCardType === null ? "" : $scope.itemCreditCardType.value,
                            creditCardCode: data.CreditCardCode,
                            creditCardNumber: data.CreditCardNumber,
                            expirationYear: $scope.itemExpYear === null ? "" : $scope.itemExpYear.value,
                            cCFirstName: data.CCFirstName,
                            cCLastName: data.CCLastName,
                            Token: "0000",
                            Vehicles: [
                                //1-st Vehicle
                                {
                                   
                                    License: data.Vehicles[0].License,
                                    IssuingState: $scope.itemStateVehicle1.value,
                                    Make: $scope.itemMakeVehicle1.value,
                                    Color: data.Vehicles[0].Color,
                                    Parker: data.Vehicles[0].Parker,
                                    DateEntered: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
                                    IsActive: 1
                                }
                              
                            ],
                            CustomerParkings: [{
                                ParkingRate: {
                                    LotNumber: $scope.itemBaseRate.LotNumber,
                                    Amount: $scope.itemBaseRate.Amount,
                                    Description: $scope.itemBaseRate.Description,
                                    BaseRateId: $scope.itemBaseRate.BaseRateId
                                }
                            }]
                        };

                        //add  2-nd Vehicle dynamically
                        //one of the 2-nd field was touched!!
                        //customer adds 2-nd Vehicle or remove it
                        if (data.Vehicles[1] !== null) {
                            //all 2-nd fields filled
                            if (data.Vehicles[1].License !== "" && $scope.itemStateVehicle2 !== null && $scope.itemMakeVehicle2 !== null) {
                                varVehicle2 = {
                                    License: data.Vehicles[1].License,
                                    IssuingState: $scope.itemStateVehicle2.value,  
                                    Make: $scope.itemMakeVehicle2.value,
                                    Color: data.Vehicles[1].Color,
                                    Parker: data.Vehicles[1].Parker,
                                    //DateEntered 
                                    DateEntered: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
                                    IsActive: 1
                                };
                                customerObj.Vehicles.push(varVehicle2);
                            }
                            //all 2-nd fields empty, i.e removing 2-nd vehicle
                            else if (data.Vehicles[1].License === "" && $scope.itemStateVehicle2 === null && $scope.itemMakeVehicle2 === null) { ''; }
                            ////one of the  2-nd field was filled, i.e. no 2-nd will be saved
                            //https://docs.angularjs.org/api/ng/service/$window
                            else if (data.Vehicles[1].License === null || $scope.itemStateVehicle2 === null || $scope.itemMakeVehicle2 === null) {

                                return false;
                            }
                            // either about to add 2-n vehicle or about to remove it
                            else {
                               
                                return false;
                            }
                        }

                        //create existing customer
                        if (customerId !== 0) {
                            //Update $scope.newUser with values From SelectS;
                            UpdateFromSelects();

                            var temp_ByIdOBJ = $scope.getCustomerByIdOBJ;

                            var customerToCreate = {
                                CustomerId: $scope.newUser.CustomerId,
                                FirstName: $scope.newUser.FirstName,
                                LastName: $scope.newUser.LastName,
                                EmailAddress: $scope.newUser.EmailAddress,
                                Address: $scope.newUser.Address,
                                City: $scope.newUser.City,
                                State: $scope.newUser.State,
                                ZipCode: $scope.newUser.ZipCode,
                                Phone: $scope.newUser.Phone,
                                Comments: $scope.newUser.Comments,
                                BaseRateId: $scope.newUser.BaseRateId,
                                VehiclesUpdate: [{
                                    VehicleId: $scope.newUser.Vehicles[0].VehicleId,
                                    CustomerId: $scope.newUser.Vehicles[0].CustomerId,
                                    License: $scope.newUser.Vehicles[0].License,
                                    IssuingState: $scope.newUser.Vehicles[0].IssuingState,
                                    Make: $scope.newUser.Vehicles[0].Make,
                                    IsActive: $scope.newUser.Vehicles[0].IsActive,
                                    Color: $scope.newUser.Vehicles[0].Color,
                                    Parker: $scope.newUser.Vehicles[0].Parker
                                }]
                            };

                            //add updated 2-nd vehicle if it exists
                            if ($scope.newUser.Vehicles[1] !== null) {
                                varVehicle2 = {
                                    //VehicleId: $scope.newUser.Vehicles[1].VehicleId,
                                    //2-nd vehicle: adding = 0 , updating = VehicleId from DB
                                    VehicleId: $scope.vehicleId_SecondVehicle,
                                    CustomerId: $scope.newUser.Vehicles[1].CustomerId,
                                    License: $scope.newUser.Vehicles[1].License,
                                    IssuingState: $scope.newUser.Vehicles[1].IssuingState,
                                    Make: $scope.newUser.Vehicles[1].Make,
                                    IsActive: $scope.newUser.Vehicles[1].IsActive,
                                    Color: $scope.newUser.Vehicles[1].Color,
                                    Parker: $scope.newUser.Vehicles[1].Parker,
                                    DateEntered: $scope.newUser.Vehicles[1].DateEntered
                                };
                                // customerToUpdate.VehiclesUpdate.push(varVehicle2);
                                customerToCreate.VehiclesUpdate.push(varVehicle2);
                            }

                            //when 2-nd vehicle removed, $scope.newUser.Vehicles[1].License must be ""
                            //reset customerToCreate.VehiclesUpdate.VehiclesUpdate[1].License to
                            //$scope.tempVehicle2_License, save to DB with IsActive=false;
                            if ($scope.newUser.Vehicles[1] !== null && $scope.newUser.Vehicles[1].IsActive === false) {
                                customerToCreate.VehiclesUpdate[1].License = $scope.tempVehicle2_License;
                                $scope.newUser.Vehicles[1].License = "";
                            }
                            //
                            $scope.customerToCreateOBJ = customerToCreate;
                            //
                            dataLayerService.putCreateAccount($scope.customerToCreateOBJ)
                                .then(
                                function (results) {
                                    if (results.data) {
                                        $scope.cutomerObjCreated = true;

                                        var newURL = $location.$$absUrl.split('Account')[0] + 'Dashboard/Index#!/home';

                                        $window.location.href = newURL;

                                    } else {
                                        $scope.errorMessage = error;
                                        showErrorMessage = true;
                                    }
                                });
                        }
                        ///////////
                    } else {
                        $scope.errorMessage = error;
                        showErrorMessage = true;
                    }
                });

        };

        $scope.submit = function () {
            console.log("Submit Form - Show Processing animation");
        };
    }
]); 