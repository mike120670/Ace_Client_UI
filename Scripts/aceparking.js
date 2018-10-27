var aceparking = angular.module('aceparking', ['ngAnimate', 'ngRoute', 'ngSanitize', 'ngCookies']);

aceparking.config(function ($routeProvider, $locationProvider) {
    // https://stackoverflow.com/questions/39811845/angularjs-routing-with-parameters
    $routeProvider
        .when('/', {
            // This is for reditect to another route
            redirectTo: function () {
                return '/home';
            }
        })
        .when("/home", {
            templateUrl: "/Html/Parker/NotificationsTransactions.html",
            controller: 'DashboardController'
        })
        .when("/paybalancedue", {
            templateUrl: "/Html/Parker/PayBalanceDue.html",
            controller: 'PayBalanceDueController'
        })
        .when('/paybalancedueform', {
            templateUrl: '/Html/Parker/PayBalanceDueForm.html',
            controller: 'PayBalanceDueController'
        })
        .when('/validations', {
            templateUrl: '/Html/Parker/Validations.html',
            controller: 'PayBalanceDueController'
        })
        .when('/lostaccesscard', {
            templateUrl: '/Html/Parker/LostAccessCard.html',
            controller: 'DashboardController'
        })
        .when('/terminate', {
            templateUrl: '/Html/Parker/TerminateMonthlyParking.html',
            controller: 'DashboardController'
        })
        .when('/refer', {
            templateUrl: '/Html/Parker/ReferFriend.html',
            controller: 'DashboardController'
        })
        .when('/CompanyDashboard/Default', {
            templateUrl: '/Html/Company/NotificationsTransactions.html',
            controller: 'CompanyDashboardController'
        })
        .when('/Default', {
            templateUrl: '/Html/Company/NotificationsTransactions.html',
            controller: 'CompanyDashboardController'
        })
        .when('/updateparker', {
            templateUrl: '/Html/Company/UpdateParker.html',
            controller: 'CompanyDashboardController'
        })
        .when('/recurring', {
            templateUrl: '/Html/Company/Recurring.html',
            controller: 'RecurringController'                
        })
        .when('/editcompanyprofile', {
            templateUrl: '/Html/Company/CompanyProfile.html',
            controller: 'CompanyDashboardController'
        })
        .when('/paybalancedueformnow', {
            templateUrl: '/Html/Company/PayBalanceDueForm.html',
            controller: 'PayBalanceDueController'
        })
        .when('/editcompanyprofile', {
            templateUrl: '/Html/Company/CompanyProfile.html',
            controller: 'CompanyProfileController'
        })
        .when('/parkerlisting', {
            templateUrl: '/Html/Company/ParkerListing.html',
            controller: 'ParkerListingController'
        })
        .when('/validations', {
            templateUrl: '/Html/Company/RequestValidations.html',
            controller: 'PayBalanceDueController'
        })
        .when('/keycard', {
            templateUrl: '/Html/Company/RequestKeycard.html',
            controller: 'KeycardController'
        })
        .when('/editparkerprofile', {
            templateUrl: '/Html/Company/EditEmployee.html',
            controller: 'EditEmployeeController'
        })

        .when('/forgot-password', {
            templateUrl: '/Html/Company/forgot-password.html',
            controller: 'forgotPasswordController'
        })
        .otherwise({
            templateUrl: "/Html/Parker/NotificationsTransactions.html",
            controller: 'DashboardController'
        });

    // Changes url to Part9#!/about
    // For ng-routing
    // $locationProvider.html5Mode(false).hashPrefix('!'); // This is for Hashbang Mode

    $locationProvider.html5Mode(true).hashPrefix('!');   // This is for Hashbang Mode

    //$locationProvider.hashPrefix('');
    //$locationProvider.html5Mode({
    //    enabled: true,
    //    requireBase: true
    //});
});

aceparking.value('user', {
    CustomerId: 0,
    EntityId: '',
    LotNumber: '',
    IsDeployed: '',
    IsPortalAdmin: ''
});

aceparking.value('company', {
    CompanyId: '',
    EntityId: '',
    LotNumber: '',
    Username: '',
    IsDeployed: '',
    IsPortalAdmin: ''
});