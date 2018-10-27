aceparking.service('staticDataLayerService', [
    function () {
        console.log('Inside staticDataLayerSerivce');
        return {
            //https://eslint.org/docs/rules/no-mixed-spaces-and-tabs
            /*eslint no-mixed-spaces-and-tabs: ["error", "smart-tabs"]*/
            // State Dropdowns
            getStates: function () {
                return [
		            { name: 'Alaska', value: 'AK' },
		            { name: 'Alabama', value: 'AL' },
		            { name: 'Arkansas', value: 'AR' },
		            { name: 'Arizona', value: 'AZ' },
		            { name: 'California', value: 'CA' },
		            { name: 'Colorado', value: 'CO' },
		            { name: 'Connecticut', value: 'CT' },
		            { name: 'Delaware', value: 'DE' },
		            { name: 'Florida', value: 'FL' },
		            { name: 'Georgia', value: 'GA' },
		            { name: 'Hawaii', value: 'HI' },
		            { name: 'Iowa', value: 'IA' },
		            { name: 'Idaho', value: 'ID' },
		            { name: 'Illinois', value: 'IL' },
		            { name: 'Indiana', value: 'IN' },
		            { name: 'Kansas', value: 'KS' },
		            { name: 'Kentucky', value: 'KY' },
		            { name: 'Louisiana', value: 'LA' },
		            { name: 'Maryland', value: 'MD' },
		            { name: 'Maine', value: 'ME' },
		            { name: 'Michigan', value: 'MI' },
		            { name: 'Minnesota', value: 'MN' },
		            { name: 'Missouri', value: 'MO' },
		            { name: 'Massachusetts', value: 'MS' },
		            { name: 'Montana', value: 'MT' },
		            { name: 'North Carolina', value: 'NC' },
		            { name: 'North Dakota', value: 'ND' },
		            { name: 'Nebraska', value: 'NE' },
		            { name: 'New Hampshire', value: 'NH' },
		            { name: 'New Jersey', value: 'NJ' },
		            { name: 'New Mexico', value: 'NM' },
		            { name: 'Nevada', value: 'NV' },
		            { name: 'New York', value: 'NY' },
		            { name: 'Ohio', value: 'OH' },
		            { name: 'Oklahoma', value: 'OK' },
		            { name: 'Oregon', value: 'OR' },
		            { name: 'Pennsylvania', value: 'PA' },
		            { name: 'Rhode Island', value: 'RI' },
		            { name: 'South Carolina', value: 'SC' },
		            { name: 'South Dakota', value: 'SD' },
		            { name: 'Tennessee', value: 'TN' },
		            { name: 'Texas', value: 'TX' },
		            { name: 'Utah', value: 'UT' },
		            { name: 'Virginia', value: 'VA' },
		            { name: 'Vermont', value: 'VT' },
		            { name: 'Washington', value: 'WA' },
		            { name: 'Wisconsin', value: 'WI' },
		            { name: 'West Virginia', value: 'WV' },
		            { name: 'Wyoming', value: 'WY' }
                ];
            },
            getParkerPayTypes: function() {
                return [
                    { name: 'Company', value: 'Company' },
                    { name: 'Own', value: 'Parker' },
                    { name: 'Both', value: 'Both' }
                ];
            },
            getMonths: function () {
                return [
                    { name: 'January', value: '01' },
                    { name: 'February', value: '02' },
                    { name: 'March', value: '03' },
                    { name: 'April', value: '04' },
                    { name: 'May', value: '05' },
                    { name: 'June', value: '06' },
                    { name: 'July', value: '07' },
                    { name: 'August', value: '08' },
                    { name: 'September', value: '09' },
                    { name: 'October', value: '10' },
                    { name: 'November', value: '11' },
                    { name: 'December', value: '12' }
                ];
            },
            getExpirationYears: function () {
                var yearThis = (new Date()).getFullYear();
                var expirationYear = [];
                for (var k = yearThis, max = yearThis + 7; k <= max; k++) {
                    expirationYear.push({ 'name': k, 'value': k });
                }
                return expirationYear;
            },
            getNextDates: function () {

                var current = moment();
                var currentMonth = current.format('MM');
                var currentYear = current.format('YYYY');
                var dayOfMonth = moment().date(Number);

                var nextMonth = moment().add(1, 'months');
                var formattedMonth = nextMonth.format('MM');
                var formattedYear = nextMonth.format('YYYY');
                
                var date1 = moment().add(1, 'days').format('MM-DD-YYYY');
                var date2 = moment().add(2, 'days').format('MM-DD-YYYY');
                var date3 = moment().add(3, 'days').format('MM-DD-YYYY');

                var fifteenth = currentMonth + "-15-" + currentYear;
                var firstOfNextMonth = formattedMonth + "-01-" + formattedYear;
                var middleOfNextMonth = formattedMonth + "-15-" + formattedYear;

                var nextMonthValues = [];
                nextMonthValues.push({ 'name': date1, 'value': date1 });
                nextMonthValues.push({ 'name': date2, 'value': date2 });
                nextMonthValues.push({ 'name': date3, 'value': date3 });

                if (dayOfMonth < 15)
                    nextMonthValues.push({ 'name': firstOfNextMonth, 'value': firstOfNextMonth });

                nextMonthValues.push({ 'name': firstOfNextMonth, 'value': firstOfNextMonth });

                if (dayOfMonth > 15)
                    nextMonthValues.push({ 'name': middleOfNextMonth, 'value': middleOfNextMonth });

                return nextMonthValues;
            },
            getCreditCardTypes: function() {
                return [
                    { name: 'Visa', value: 'visa' },
                    { name: 'Master Card', value: 'mastercard' },
                    { name: 'American Express', value: 'amex' }
                ];
            },
            getCars: function () {
                return [
                    { name: 'Acura', value: 'Acura' },
                    { name: 'Alfa Romeo', value: 'Alfa Romeo' },
                    { name: 'Aston Martin', value: 'Aston Martin' },
                    { name: 'Audi', value: 'Audi' },
                    { name: 'Bentley', value: 'Bentley' },
                    { name: 'BMW', value: 'BMW' },
                    { name: 'Bugatti', value: 'Bugatti' },
                    { name: 'Cadillac', value: 'Cadillac' },
                    { name: 'Chevrolet', value: 'Chevrolet' },
                    { name: 'Chrysler', value: 'Chrysler' },
                    { name: 'Citroen', value: 'Citroen' },
                    { name: 'Daewoo', value: 'Daewoo' },
                    { name: 'Dodge', value: 'Dodge' },
                    { name: 'Ferrari', value: 'Ferrari' },
                    { name: 'Fiat', value: 'Fiat' },
                    { name: 'Ford', value: 'Ford' },
                    { name: 'Honda', value: 'Honda' },
                    { name: 'Hummer', value: 'Hummer' },
                    { name: 'Hyundai', value: 'Hyundai' },
                    { name: 'Jaguar', value: 'Jaguar' },
                    { name: 'Jeep', value: 'Jeep' },
                    { name: 'KIA', value: 'KIA' },
                    { name: 'Lamborghini', value: 'Lamborghini' },
                    { name: 'Land Rover', value: 'Land Rover' },
                    { name: 'Lexus', value: 'Lexus' },
                    { name: 'Lincoln', value: 'Lincoln' },
                    { name: 'Maserati', value: 'Maserati' },
                    { name: 'Mazda', value: 'Mazda' },
                    { name: 'Mercedes', value: 'Mercedes' },
                    { name: 'Mitsubishi', value: 'Mitsubishi' },
                    { name: 'Nissan', value: 'Nissan' },
                    { name: 'Pontiac', value: 'Pontiac' },
                    { name: 'Porsche', value: 'Porsche' },
                    { name: 'Range Rover', value: 'Range Rover' },
                    { name: 'Renault', value: 'Renault' },
                    { name: 'Rolls-Royce', value: 'Rolls-Royce' },
                    { name: 'Saab', value: 'Saab' },
                    { name: 'Smart', value: 'Smart' },
                    { name: 'Subaru', value: 'Subaru' },
                    { name: 'Suzuki', value: 'Suzuki' },
                    { name: 'Tesla', value: 'Tesla' },
                    { name: 'Toyota', value: 'Toyota' },
                    { name: 'Volkswagen', value: 'Volkswagen' },
                    { name: 'Volvo', value: 'Volvo' },
                    { name: 'OTHER', value: 'OTHER' }
                ];
            }
        };
    }
]);

aceparking.service('commonService', [
    function() {
        return {
            iterate: function(obj) {
                for (var property in obj) {
                    if (obj.hasOwnProperty(property)) {
                        if (typeof obj[property] == "object")
                            iterate(obj[property]);
                        else
                            console.log(property + "   " + obj[property]);
                    }
                }
            },
            // emulate PHP's var_dump function
            dump: function(v) {
                switch (typeof v) {
                    case "object":
                        console.log('Object------------');
                        for (var i in v) {
                            if (v.hasOwnProperty(i)) {
                                console.log(i + ":" + iterate(v[i]));
                            }
                        }
                        break;
                    default: //number, string, boolean, null, undefined 
                        console.log(typeof v + ":" + v);
                        break;
                }
            },
            extractToken: function(input) {
                var work = input.replace(/(?:\r\n|\r|\n)/g, '').trim();
                var len = work.length;

                var res = work.substr(0, len - 1);

                return JSON.parse(res.substr(17));	// 17 = 'Payeezy.callback('                
            }
        };
    }
]);
