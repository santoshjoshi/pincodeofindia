
/*
 * GET home page.
 */

exports.states = function(req, res){

	res.writeHead(200, {"Content-Type": "text/plain"});
	res.write("200 Not found states");
	res.end();
};