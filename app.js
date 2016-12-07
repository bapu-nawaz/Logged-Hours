'use-strict'

var app = angular
	
	.module('Logged Hours', [		// add name for your app (this should be same as in bower.json)
		'ngMaterial',			// add modules here and their js files in index.html to use them
		'ui.router'
	])

	.config([					// creating a model to define screens for your app
		'$urlRouterProvider',	// add Provider libraries to define state/url of your screens
		'$stateProvider',
		function (
			$urp,
			$sp) {

				// special cases (un comment them to use as needed)
				// $urp.when('/dashboard','/dashboard/ship');
				$urp.otherwise('/login');

				// defining screens here
				$sp.state('base', {
					url: '',
					abstract: true,
					templateUrl: 'views/base.html',
				});
					$sp.state('login', {
						url: '/login',
						parent: 'base',
						templateUrl: 'views/login.html',
						controller: 'loginCTRL'
					});
					$sp.state('dashboard', {
						url: '/dashboard',
						parent: 'base',
						templateUrl: 'views/dashboard.html',
						controller: 'dashboardCTRL'
					});
		}
	]);