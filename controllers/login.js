'use-strict'
app.controller('loginCTRL', [
	'$scope', '$location',
	function($scope, $location) {

		$scope.defaults = {
			"login": {
				"user": "",
				"pass": ""
			},
			"dummy": {
				"user": "admin",
				"pass": "admin"
			},
			"error": {
				"status": false,
				"message": ""
			}
		}

		var printInfo = function (TAG, text) {
			// This will print all logs, uncomment for debugging only.
			console.log("INFO:",TAG,text);
		}
		var isEmpty = function(field) {
			printInfo("Login","isEmpty called: '"+field+"'.");
			if( field == "" || field == null )
				return true;
			return false;
		}

		var setError = function(msg) {
			printInfo("Login","Error set: "+msg);
			$scope.defaults.error.status = true;
			$scope.defaults.error.message = msg;			
		}

		$scope.login = function () {
			printInfo("Login","Button clicked");
			if ( isEmpty($scope.defaults.login.user) || isEmpty($scope.defaults.login.pass) ) 
				setError("Please fill the required fields.");

			else if ( $scope.defaults.login.user != $scope.defaults.dummy.user )
				setError("Can't find the user specified");

			else if ( $scope.defaults.login.pass != $scope.defaults.dummy.pass )
				setError("Incorrect Password.");

			else
            	$location.path('/dashboard');    
		}
	}
]);