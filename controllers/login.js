'use-strict'
app.controller('loginCTRL', [
	'$scope', '$location', 'API',
	function($scope, $location, $api) {

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

			else if ( $scope.defaults.login.user != $scope.defaults.dummy.user ) {
				var data = "?name="+$scope.defaults.login.user+"&pass="+$scope.defaults.login.pass;
				$api.login(data).then(function(response){
					if( !isEmpty(response.id) ) {
						$location.path('/dashboard/'+response.id+'/profile');
					}
				});
				setError("Can't find these details in our database.");
			}

			else if ( $scope.defaults.login.pass != $scope.defaults.dummy.pass )
				setError("Incorrect Password.");

			else
            	$location.path('/admin');    
		}
	}
]);