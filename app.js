'use-strict'

var app = angular
	
	.module('Logged Hours', [		// add name for your app (this should be same as in bower.json)
		'ngMaterial',			// add modules here and their js files in index.html to use them
		'ui.router'
	])

	.config([					// creating a model to define screens for your app
		'$urlRouterProvider',	// add Provider libraries to define state/url of your screens
		'$stateProvider',
		'$mdThemingProvider',
		function (
			$urp,
			$sp,
			$mdt) {

				// special cases (un comment them to use as needed)
				$urp.when('/dashboard','/dashboard/0/profile');
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
					$sp.state('admin', {
						url: '/admin',
						parent: 'base',
						templateUrl: 'views/admin/overview.html',
						controller: 'adminCTRL'
					});
					$sp.state('dashboard', {
						url: '/dashboard/:id',
						parent: 'base',
						templateUrl: 'views/dashboard.html',
						controller: 'dashboardCTRL'
					});
						$sp.state('profile', {
							url: '/profile',
							parent: 'dashboard',
							templateUrl: 'views/dashboard/profile.html'
						});

				$mdt.theme('default')
    				.primaryPalette('green')
    				.accentPalette('yellow')
    				.dark();
    			$mdt.enableBrowserColor({
				      theme: 'default', // Default is 'default'
				      palette: 'primary', // Default is 'primary', any basic material palette and extended palettes are available
				      hue: '800' // Default is '800'
				    });
		}
	]);