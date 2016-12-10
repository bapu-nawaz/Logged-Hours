app.factory("API",[
	"$http", "$q",
	function ($http, $q) {

		function API() {
			var server 				= "server/web-scripts";
			this.addLogURL 			= server + "/addLog.php";
			this.changePasswordURL 	= server + "/changePassword.php";
			this.deleteLogURL 		= server + "/deleteLog.php";
			this.loginURL 			= server + "/login.php";
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

		API.prototype.getUserDetailsByID = function(id) {
			var url = this.userDetailsURL + "?id=" + id;
			return get(url);
		};

		API.prototype.login = function(data) {
			var url = this.loginURL + data;
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