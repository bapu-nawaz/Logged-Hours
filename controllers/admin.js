'use-strict'
app.controller('adminCTRL', [
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
					{"name": "Change Password", "icon": "assets/svg/settings.svg", "action":0},
					{"name": "Logout", "icon": "assets/svg/logout.svg", "action":1}
				]
			},
			'unconfirmedCount': 0,
			'unconfirmed': {},
			'employees': []
		};

		var approveLog = function (id) {
			$api.approveLog({"id": id}).then(function (response) {
				init();
			});
		}

		var arrayHas = function (array, has) {
			for (var i = 0; i < array.length; i++) {
				if(array[i].name == has)
					return i;
			}
			return -1;
		}

		var deleteLog = function (data) {
			printInfo("DL",data);
			$api.disapproveLog(data).then(function (response) {
				init();
			});
		}

		var disapproveLog = function(log, ev) {
			$dialog.show({
				templateUrl: 'views/admin/disapproveDialog.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:false,
				fullscreen: true, // Only for -xs, -sm breakpoints.
				locals: {"log": log},
				controller: ['$scope', '$mdDialog', 'log', function($scope, $mdDialog, log) { 
					$scope.log = log;
					$scope.comments = "";
				
					$scope.hide = function() {
						$mdDialog.hide();
					};

					$scope.cancel = function() {
						$mdDialog.cancel();
					};

					$scope.done = function() {
						$mdDialog.hide({"id":$scope.log.id, "comment":$scope.comments});
					};
				}]
			})
			.then(function(info) {
				if (info != null) {
					deleteLog(info);
				} else
				printInfo("INFO IS NULL HERE");
			}, function() {
				printInfo('You cancelled the dialog.');
			});
		}

		var groupedList = function() {
			employees = [];
			for (var i = 0; i < $scope.defaults.unconfirmed.length; i++) {
				if( $scope.defaults.unconfirmed[i].paid == 2 ) {
					$scope.defaults.unconfirmedCount++;
				}
				var index = arrayHas(employees, $scope.defaults.unconfirmed[i].emp);
				if( index != -1 ) {
					employees[index].list.push($scope.defaults.unconfirmed[i]);
				} else {
					employees.push({"name": $scope.defaults.unconfirmed[i].emp, "list": [], "hours": 0, "rate": $scope.defaults.unconfirmed[i].rate});
					i--;
				}
			}
			$scope.defaults.employees = setEmployeeRecords(employees);
		}

		var init = function() {
			$api.getUnconfirmedHours().then(function(response){
				$scope.defaults.unconfirmed = response;
				setDates();
				groupedList();
				printInfo("Grouped List", $scope.defaults.employees);
			});
		}

		var multiPay = function (id) {
			printInfo("MP:","Button Clicked");
			$api.multiPay(id).then(function(){
				printInfo("MP:","API Response Success");
				init();
			});
		}

		var navActions = function (action) {
			switch(action) {
				case 1:
					$location.path('/login');
					break;

				default:
					printInfo("NavItemClick", "No Action Selected");
			}
		}

		var printInfo = function (TAG, text) {
			// This will print all logs, uncomment for debugging only.
			console.log("INFO:",TAG,text);
		}		

		var setDates = function() {
			for (var i = 0; i < $scope.defaults.unconfirmed.length; i++) {
				$scope.defaults.unconfirmed[i].end = new Date($scope.defaults.unconfirmed[i].end);
				$scope.defaults.unconfirmed[i].date = new Date($scope.defaults.unconfirmed[i].date);
				$scope.defaults.unconfirmed[i].start = new Date($scope.defaults.unconfirmed[i].start);
			}
		}

		var setEmployeeRecords = function(array) {
			for (var i = 0; i < array.length; i++)  
				for (var j = 0; j < array[i].list.length; j++) 
					if(array[i].list[j].paid == 0) {
						array[i].hours += (array[i].list[j].end - array[i].list[j].start)/3600000;
						array[i].count++;
					}
			return array;
		}

		var singlePay = function (id) {
			$api.singlePay(id).then(function(response){
				init();
			});
		}

		var workedHours = function(number) {
			number = ""+number/3600000;
			number = number.split(".");
			number = number[0] + ":" + ((number[1]*6>60)?(number[1]*6)/10:(number[1]!=null)?number[1]*6:"00");
			return number;
		}

		init();

		$scope.approveLog = approveLog;
		$scope.disapproveLog = disapproveLog;
		$scope.multiPay = multiPay;
		$scope.singlePay = singlePay;
		$scope.workedHours = workedHours;
	}
]);