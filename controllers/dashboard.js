'use-strict'
app.controller('dashboardCTRL', [
	'$scope', '$location', '$mdSidenav', '$mdToast', '$mdDialog', 'API', '$stateParams',
	function($scope, $location, $sideNav, $toast, $dialog, $api, $sp) {

		$scope.defaults = {
			'user': {},
			'fab': {
				'isOpen': false,
				'svg': "assets/svg/plus.svg"
			},
			'weekday': ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		};

		var printInfo = function (TAG, text) {
			// This will print all logs, uncomment for debugging only.
			console.log("INFO:",TAG,text);
		}

		var getUserDetails = function() {
			$api.getUserDetailsByID($sp.id)
			.then(function(response){
				$scope.defaults.user = response;
			});
		}

		$scope.addLogToDB = function(data) {
			data.name = data.name.replace("'", "`");
			data.date = data.date.getDate()+"/"+(data.date.getMonth()+1);
			data.start = data.start.getHours()+(data.start.getMinutes()/60);
			data.end = data.end.getHours()+(data.end.getMinutes()/60);
			data['user'] = $sp.id;
			printInfo("LOG",data);
			$api.addLog(data).then(function(response){
				if(response=="1")
					getUserDetails();
			});
		}

		$scope.fabClick = function(){
			/* for more than one task
			$scope.defaults.fab.svg = ($scope.defaults.fab.isOpen) ? "assets/svg/plus.svg" : "assets/svg/multiply.svg";
			$scope.defaults.fab.isOpen = !$scope.defaults.fab.isOpen;
			*/
			$scope.showAddLogDialog();
		}

		$scope.testClick = function() {
			printInfo("User Details:",$scope.defaults.user);
		}

		function DialogController($scope, $mdDialog) {

			$scope.job = {
				"details": {
					"name": "",
					"date": "",
					"start": "",
					"end": "",
					"notes": ""
				},
				"screen": 0,
				"buttonText": "Next",
				"helpText": [
								"Whose house/unit was cleaned?",
								"When was the cleaning done?",
								"When did you start?",
								"When did you finished cleaning?",
								"All Done! Add your log to the system. Add notes if you want to."	]
			};

			$scope.hide = function() {
				$mdDialog.hide();
			};

			$scope.cancel = function() {
				$mdDialog.cancel();
			};

			$scope.next = function() {
				$scope.job.errorMessage = "";
				switch($scope.job.screen) {
					case 0:
						if( $scope.job.details.name == "" ) {
							$scope.job.screen--;
							$scope.job.errorMessage = "Please don't leave this blank!";
						}
						break;

					case 1:
						if( $scope.job.details.date == "" ) {
							$scope.job.screen--;
							$scope.job.errorMessage = "Please don't leave this blank!";
						}else if( $scope.job.details.date > new Date() ) {
							$scope.job.screen--;
							$scope.job.errorMessage = "Cannot make future logs!";
						}
						break;

					case 2:
						if( $scope.job.details.start == "" ) {
							$scope.job.screen--;
							$scope.job.errorMessage = "Please don't leave this blank!";
						}
						break;

					case 3:
						if( $scope.job.details.end == "" ) {
							$scope.job.screen--;
							$scope.job.errorMessage = "Please don't leave this blank!";
						}else if( $scope.job.details.end < $scope.job.details.start ) {
							$scope.job.screen--;
							$scope.job.errorMessage = "End time cannot be before the Start time!";
						}
						$scope.job.buttonText = "Add to Log";
						break;

					default:
						$mdDialog.hide($scope.job.details);
				}
				$scope.job.screen++;
			};

		}

		$scope.showAddLogDialog = function(ev) {
			$dialog.show({
				controller: DialogController,
				templateUrl: 'views/dashboard/addLogDialog.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				fullscreen: true // Only for -xs, -sm breakpoints.
			})
			.then(function(info) {
				if (info != null) {
					$scope.addLogToDB(info);
				}
			}, function() {
				printInfo('You cancelled the dialog.');
			});
		};

		getUserDetails();

		$scope.logs = [
			{"name": "Alex House", "date": new Date(), "start": new Date(), "end": new Date()},
			{"name": "Alex House", "date": new Date(), "start": new Date(), "end": new Date()},
			{"name": "Alex House", "date": new Date(), "start": new Date(), "end": new Date()},
			{"name": "Alex House", "date": new Date(), "start": new Date(), "end": new Date()},
			{"name": "Alex House", "date": new Date(), "start": new Date(), "end": new Date()}
		]
	}
]);