app.factory("API",[
	"$http", "$q",
	function ($http, $q) {

		function API() {
			var server 				= "server/web-scripts";
			this.addLogURL 			= server + "/addLog.php";
			this.approveLogURL		= server + "/approveLog.php";
			this.changePasswordURL 	= server + "/changePassword.php";
			this.deleteLogURL 		= server + "/deleteLog.php";
			this.disapproveLogURL 	= server + "/disapproveLog.php";
			this.employeeListURL 	= server + "/employeeList.php";
			this.loginURL 			= server + "/login.php";
			this.logListURL			= server + "/logList.php";
			this.multiPayURL		= server + "/multiPay.php?id=";
			this.singlePayURL		= server + "/singlePay.php?id=";
			this.unconfirmedHoursURL= server + "/unconfirmedHours.php";
			this.userDetailsURL 	= server + "/userInfo.php";
		};

		API.prototype.addLog = function(data) {
			var url = this.addLogURL + 
					"?name=" + data.name +
					"&date=" + data.date +
					"&start="+ data.start +
					"&end="  + data.end+
					"&notes="+ data.notes+
					"&user=" + data.user;
			return get(url);
		};

		API.prototype.approveLog = function(data) {
			var url = this.approveLogURL +
					"?id=" + data.id;
			return get(url); 
		};

		API.prototype.changePassword = function(data) {
			var url = this.changePasswordURL +
					"?id=" + data.id +
					"&pass=" + data.pass;
			return get(url); 
		};

		API.prototype.deleteLog = function(logID) {
			var url = this.deleteLogURL + "?id=" + logID;
			return get(url);
		};

		API.prototype.employeeList = function() {
			return get(this.employeeListURL);
		};

		API.prototype.employeeDetails = function(id) {
			var url = this.logListURL + "?id=" + id;
			return get(url);
		};

		API.prototype.disapproveLog = function(data) {
			var url = this.disapproveLogURL +
					"?id=" + data.id +
					"&comment=" + data.comment;
			return get(url); 
		};

		API.prototype.getUnconfirmedHours = function() {
			return get( this.unconfirmedHoursURL );
		};

		API.prototype.getUserDetailsByID = function(id) {
			var url = this.userDetailsURL + "?id=" + id;
			return get(url);
		};

		API.prototype.login = function(data) {
			var url = this.loginURL + data;
			return get(url);
		};

		API.prototype.multiPay = function(id) {
			printInfo("MP:","API Called");
			var url = this.multiPayURL + id + "&date=" + new Date().toISOString();
			return get(url);
		};

		API.prototype.singlePay = function(id) {
			var url = this.singlePayURL + id + "&date=" + new Date().toISOString();
			return get(url);
		};

		var printInfo = function (TAG, text) {
			// This will print all logs, uncomment for debugging only.
			console.log("INFO:",TAG,text);
		}

		var post = function(url, data) {		        
		    var deferred = $q.defer();
		    var data = {"data": data};
		    $http.post(url, data)
		        .success(function(data, status, headers, config) {
		        	printInfo("RES",data);
		            deferred.resolve(data);  
		        })
		        .error(function(data, status, headers, config) {
		            printInfo('an error has occured'+ data, status);
		            // execute callback function
		            deferred.reject(data);
		        });
		    return deferred.promise;
		};
	
	    var get = function(url) {
	        
	        var deferred = $q.defer();
	        $http.get(url)
	            .success(function(data, status, headers, config) {
		            // printInfo('Response:', data);
	                deferred.resolve(data);
	            })
	            .error(function(data, status, headers, config) {
		            printInfo('an error has occured: '+ data, status);
	                // execute callback function
	                deferred.reject(data);
	            });
	        return deferred.promise;
	    };

		return new API();

	}
]);