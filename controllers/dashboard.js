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
			'weekday': ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			'nav': {
				'list': [
					{"name": "My Paid Hours", "icon": "assets/svg/clock.svg", "action":2},
					{"name": "Change Password", "icon": "assets/svg/settings.svg", "action":0},
					{"name": "Logout", "icon": "assets/svg/logout.svg", "action":1}
				],
				'paidHours': false
			}
		};

		var printInfo = function (TAG, text) {
			// This will print all logs, uncomment for debugging only.
			console.log("INFO:",TAG,text);
		}
		
		var setLogDateTime = function(data) {
			$scope.defaults.user = data;
			if($scope.defaults.user.logs!=null)
			for( var i=0; i<$scope.defaults.user.logs.length; i++) {
				$scope.defaults.user.logs[i].date = new Date($scope.defaults.user.logs[i].date);
				$scope.defaults.user.logs[i].start= new Date($scope.defaults.user.logs[i].start);
				$scope.defaults.user.logs[i].end  = new Date($scope.defaults.user.logs[i].end);
				if($scope.defaults.user.logs[i].paid_date != null)
					$scope.defaults.user.logs[i].paid_date = new Date($scope.defaults.user.logs[i].paid_date);
			}
			printInfo("setLog", "Done");
		}

		var getUserDetails = function() {
			$api.getUserDetailsByID($sp.id)
			.then(function(response){
				setLogDateTime(response);
				printInfo("API CALLED:",$scope.defaults.user);
			});
		}

		var navItemActions = function(action) {
			$scope.toggleSideNav();
			switch(action) {
				case 0:
					$scope.showPasswordChangeDialog();
					break;

				case 1:
					$location.path('/login');
					break;

				case 2:
					$scope.defaults.nav.paidHours = !$scope.defaults.nav.paidHours;
					$scope.defaults.nav.list[0].name = (!$scope.defaults.nav.paidHours) ? "My Paid Hours" : "My Unpaid Hours";
					break;

				default:
					printInfo("Nav Item ("+action+"):","No Action Selected");
			}
		}

		$scope.toggleSideNav = function () {
			$sideNav('left').toggle();
		}

		$scope.formatedHours = function (hours) {
			if (hours > 12)
				hours = hours-12;
			return hours;
		}
		
		$scope.formatedMinutes = function (min) {
			return (min<10) ? "0"+min : min;
		}
		
		$scope.addLogToDB = function(data) {
			data.name = data.name.replace("'", "`");
			data.date = data.date.toISOString();
			data.start = data.start.toISOString();
			data.end = data.end.toISOString();
			data['user'] = $sp.id;
			printInfo("LOG",data);
			$api.addLog(data).then(function(response){
				if(response=="1")
					getUserDetails();
			});
		}

		$scope.fabClick = function(){
			/*// for more than one task
			$scope.defaults.fab.svg = ($scope.defaults.fab.isOpen) ? "assets/svg/plus.svg" : "assets/svg/multiply.svg";
			$scope.defaults.fab.isOpen = !$scope.defaults.fab.isOpen;
			*/
			$scope.showAddLogDialog();
		}

		$scope.changePassword = function(pass) {
			var data = { 'id': $sp.id, 'pass': pass };
			$api.changePassword(data);
		}

		$scope.deleteLog = function(logID) {
			$api.deleteLog(logID).then(function(response){
				getUserDetails();
			});
		}

		$scope.showAddLogDialog = function(ev) {
			$dialog.show({
				templateUrl: 'views/dashboard/addLogDialog.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				fullscreen: true, // Only for -xs, -sm breakpoints.
				controller: ['$scope', '$mdDialog', function ($scope, $mdDialog) {
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

				}]
			})
			.then(function(info) {
				if (info != null) {
					$scope.addLogToDB(info);
				}
			}, function() {
				printInfo('You cancelled the dialog.');
			});
		};

		$scope.showPasswordChangeDialog = function(ev) {
			$dialog.show({
				templateUrl: 'views/dashboard/changePasswordDialog.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				fullscreen: true, // Only for -xs, -sm breakpoints.
				controller: ['$scope', '$mdDialog', function ($scope, $mdDialog) {
					$scope.text = {
						'old': "",
						'new': "",
						'confirm': "",
						'errorMessage': ""
					}

					$scope.hide = function() {
						$mdDialog.hide();
					};

					$scope.cancel = function() {
						$mdDialog.cancel();
					};

					$scope.done = function() {
						$scope.text.errorMessage = "";
						if( $scope.text.old=="" || $scope.text.new=="" || $scope.text.confirm=="" )
							$scope.text.errorMessage = "Please fill all fields.";
						else if( $scope.text.new != $scope.text.confirm )
							$scope.text.errorMessage = "Passwords do not match.";
						else
							$mdDialog.hide($scope.text.confirm);
					};
				}]
			})
			.then(function(info) {
				if (info != null) {
					$scope.changePassword(info);
				}
			}, function() {
				printInfo('You cancelled the dialog.');
			});
		};

		$scope.showDeleteLogDialog = function(log, ev) {
			$dialog.show({
				templateUrl: 'views/dashboard/deleteLogDialog.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:false,
				fullscreen: true, // Only for -xs, -sm breakpoints.
				locals: {"log": log},
				controller: ['$scope', '$mdDialog', 'log', function($scope, $mdDialog, log) { 
					$scope.log = log;
				
					$scope.hide = function() {
						$mdDialog.hide();
					};

					$scope.cancel = function() {
						$mdDialog.cancel();
					};

					$scope.done = function() {
						$mdDialog.hide($scope.log.id);
					};
				}]
			})
			.then(function(info) {
				if (info != null) {
					$scope.deleteLog(info);
				}
			}, function() {
				printInfo('You cancelled the dialog.');
			});
		};

		$scope.showSimpleToast = function(message) {
		    $toast.show($toast.simple()
		        .textContent(message)
		        .position('bottom right')
		        .hideDelay(3000)
		    );
		}

		$scope.unpaidLogs = function(logs) {
			return logs.paid == 0;
		}

		$scope.paidLogs = function(logs) {
			return logs.paid == 1;
		}

		$scope.pendingLogs = function(logs) {
			return logs.paid == 2 || logs.paid == 3;
		}

		getUserDetails();

		$scope.navItemClick = navItemActions;
	}
]);