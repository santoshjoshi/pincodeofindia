
var redis = require("redis");
var redisClient = redis.createClient(6379, "127.0.0.1", null);

redisClient.on("error", function(err) {
	console.log("Error " + err);
});

function getStates(param, response){
	
	response.writeHead(200, {"Content-Type": "text/plain"});
	console.log("param is ^^"+param+"--");
  
	var args = ["districts", param];
   	 redisClient.zrank(args, function (err, start){
		console.log("start "+start);

     	var args1 = ["districts", start.toString(), Number(start + 40)] ;
     	var jsonResult = [];
     	redisClient.zrange(args1, function (err, range){
			//response.write("\nData from redis.\n");
			for (var i = 0, j = 0 ; i < range.length; i++) {

				//response.write(range[i] +"\n");
				if(range[i].toString().charAt(range[i].toString().length-1) == "*"){
					jsonResult[j] = range[i].replace("*","");
					j++;
				}
			};
			response.write(JSON.stringify(jsonResult, null, 4));
        	response.end();
		});
   	 });
}

function getDistricts(stateId, param, response){

	var headerKey = 'Cache-Control'
	var noCacheKey = 'no-cache'
	var maxAgeKey = 'max-age'
	var mustRevalidateKey = 'must-revalidate'
	//response.header(headerKey, maxAgeKey + "=" + 36000 );
	response.writeHead(200, {"Content-Type": "text/plain"});

	console.log("param is ^^"+param+"--");
  
	var args = ["districts"+stateId, param.toString().toLowerCase()];
	var searchDistrictStartingChar = param.toString().charAt(0).toLowerCase();

   	redisClient.zrank(args, function (err, start){
	console.log("start "+start);

     	var args1 = ["districts"+stateId, start.toString(), Number(start + 20)] ;
     	var jsonResult = [];
     	redisClient.zrange(args1, function (err, range){
     		console.log("--"+range);
			for (var i = 0, j = 0 ; i < range.length; i++) {
				if(searchDistrictStartingChar != range[i].toString().charAt(0).toLowerCase() ){
					// if the first char differ then we will not show those in autocomplete
					break;
				}
				if(range[i].toString().charAt(range[i].toString().length-1) == "_"){
					var result = [];
					result[0] = range[i].split("__")[0];
					result[1] = range[i].split("__")[1] ;
					jsonResult[j] = result;
					j++;
				}
			};
			response.write(JSON.stringify(jsonResult, null, 4));
        	response.end();
		});
   	 });
}

function getPinCode(stateId, districtId, param, response){

	var headerKey = 'Cache-Control'
	var noCacheKey = 'no-cache'
	var maxAgeKey = 'max-age'
	var mustRevalidateKey = 'must-revalidate'
	//response.header(headerKey, maxAgeKey + "=" + 36000 );
	response.writeHead(200, {"Content-Type": "text/plain"});

	console.log("param is ^^"+param+"--");
  
	var args = ["areas"+districtId+"_"+stateId, param.toString().toLowerCase()];
	var searchAreaStartingChar = param.toString().charAt(0).toLowerCase();

   	redisClient.zrank(args, function (err, start){
	console.log("start "+start);

     	var args1 = ["areas"+districtId+"_"+stateId, start.toString(), Number(start + 10)] ;
     	var jsonResult = [];
     	redisClient.zrange(args1, function (err, range){
     		console.log("--"+range);
			for (var i = 0, j = 0 ; i < range.length; i++) {
				if(searchAreaStartingChar != range[i].toString().charAt(0).toLowerCase() ){
					// if the first char differ then we will not show those areas in autocomplete
					break;
				}
				if(range[i].toString().charAt(range[i].toString().length-1) == "*"){
					var result = [];
					result[0] = range[i].split("__")[0];
					result[1] = range[i].split("__")[1].substring(0, range[i].split("__")[1].toString().length-1) ;
					jsonResult[j] = result;
					j++;
				}
			};
			response.write(JSON.stringify(jsonResult, null, 4));
        	response.end();
		});
   	 });
}
	
exports.states = getStates;
exports.districts = getDistricts;
exports.pincodes = getPinCode;