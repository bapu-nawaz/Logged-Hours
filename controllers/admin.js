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
			'weekday': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
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

		var formattedDate = function (date) {
			if(date)
			return date.getDate()+"/"+(date.getMonth()+1)+" "+$scope.defaults.weekday[date.getDay()];
		}

		var init = function() {
			$api.employeeList().then(function(response) {
				$scope.defaults.employeesList = response;
				printInfo("Employee List:", response);
				selectEmployee($scope.defaults.employeesList[0].id);
				$scope.defaults.employeeRate = $scope.defaults.employeesList[0].rate;
			});
			$scope.defaults['selectedLog'] = null;
		}

		var logStatus = function (number) {
			switch (number) {
				case "0": return "Un Paid";
				case "1": return "Paid";
				case "2": return "Un Confirmed";
				case "3": return "Disapproved";
				default: return "Unknown";
			}
		}

		var multiPay = function (id) {
			showConfirmDialog(0, id);
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

		var selectEmployee = function (id) {
			$api.employeeDetails(id).then(function(response) {
				$scope.defaults.employeeHours = setDates(response);
			});
		}

	    var showConfirmDialog = function(type, info, ev) {
	    	var data = {"title": "", "message": "", "positive": "", "negative": ""};
	    	switch(type) {
	    		case 0: // Pay All
	    			data.title = "Pay All";
	    			data.message = "Are you sure, you want to pay ALL confirmed Hours of this employee? $"+(totalWorkingHours()*$scope.defaults.employeeRate);
	    			data.positive = "Yes";
	    			data.negative = "No, take me back.";
	    			break;
	    	}
    		var confirm = $dialog.confirm()
				.title(data.title)
				.textContent(data.message)
				.ariaLabel('Confirm Dialog')
				.targetEvent(ev)
				.ok(data.positive)
				.cancel(data.negative);

		    $dialog.show(confirm).then(function() {
				switch(type) {
					case 0: // Pay All
						$api.multiPay(info).then(function(){
							init();
						});						
						break;
				}
			}, function() {
				switch(type) {
					case 0: // Pay All
						break;
				}
			});
	    }

		var setDates = function(array) {
			for (var i = 0; i < array.length; i++) {
				array[i].end = new Date(array[i].end);
				array[i].date = new Date(array[i].date);
				array[i].start = new Date(array[i].start);
			}
			return array;
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

		var hourCount = function (type) {
			type = parseInt(type);
			var count = 0;
			if($scope.defaults.employeeHours!=null)
			for(var i=0; i<$scope.defaults.employeeHours.length; i++)
				if($scope.defaults.employeeHours[i].paid==type)
					count++;
			return count;
		}

		var workedHours = function(number) {
			number = ""+number/3600000;
			number = number.split(".");
			number = number[0] + ":" + ((number[1]*6>60)?(number[1]*6)/10:(number[1]!=null)?number[1]*6:"00");
			return number;
		}
		var formattedTime = function (date) {
			var time = "";
			if(date)
				time =
			addZero( to12HourFormat( date.getHours() ) ) + ":" +
			addZero( date.getMinutes() ) + " " +
			toMeridian( date.getHours() );
			return time;
		}
		var addZero = function (number) {
			if ( number<10 )
				return "0"+number;
			return number;
		}
		var to12HourFormat = function (number) {
			if ( number>12 )
				return number-12;
			return number;
		}
		var toMeridian = function (number) {
			if ( number>11 )
				return "PM";
			return "AM";
		}

		var totalWorkingHours = function () {
			var totalTime = 0;
			for (var j=0; j<$scope.defaults.employeeHours.length; j++)
				if( $scope.defaults.employeeHours[j].paid == 0 )
				totalTime += ($scope.defaults.employeeHours[j].end - $scope.defaults.employeeHours[j].start)/3600000;
			return totalTime;
		}

		init();

		$scope.approveLog = approveLog;
		$scope.disapproveLog = disapproveLog;
		$scope.employeesHourCount = hourCount;
		$scope.formattedDate = formattedDate;
		$scope.formattedTime = formattedTime;
		$scope.getLogStatus = logStatus;
		$scope.getTotalWorkingHours = totalWorkingHours;
		$scope.multiPay = multiPay;
		$scope.singlePay = singlePay;
		$scope.workedHours = workedHours;
		$scope.selectEmployee = selectEmployee;
	}
]);