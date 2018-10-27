aceparking.factory('moment', function($window) {
    return $window.moment;
});

aceparking.factory('numeral', function($window) {
    return $window.numeral;
});

aceparking.factory('commonLib', function($window, $location) {
    var root = {};

    root.cleanPhone = function(input) {
        var work = '';
        if (input === '') return input;
        if (input.length > 0) {
            work = input.trim();
            if (work === '') return input;
        }

        return work.replace(/\(|\)|-| /g, '');
    };

    root.formatPhone = function (input) {
        var work = '';
        if (input === '') return input;
        if (input.length > 0) {
            work = input.trim();
            if (work === '') return input;
        }

        if (work.length === 7) {
            return work.substr(0, 3) + '-' + work.substr(3);
        }

        if (work.length === 10) {
            return work.substr(0, 3) + '-' + work.substr(3, 3) + '-' + work.substr(6);
        }

        return work;
    }

    root.getTwoDigitYear = function(input) {
        return input - 2000;
    }

    root.dump = function(v) {
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
    }

    root.redirect = function(hash) {
        $location.path(hash);
    }

    root.isNullOrEmpty = function(s) {
        return (s === null || s === "");
    }

    root.toCurrency = function(amount) {
        return amount === undefined || root.isNullOrEmpty(amount)
            ? '$0.00'
            : amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    root.sumByProperty = function(objectArray, propertyName) {
        if (typeof objectArray === 'undefined') return 0;
        if (objectArray === null) return 0;
        if (objectArray.length === 0) return 0;

        return objectArray.reduce(function (a, b) {
            return a + b[propertyName];
        }, 0);
    }

    return root;
});