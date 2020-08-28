var request = require('request');

//Custom Header pass
var headersOpt = {
"Cookie": "logged_in=no",
"Authorization": "token "+process.env.GITHUBBOT,
'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36'
};

exports.sendReport = (req, res) => {
  console.log(req.body);
  request({
	method:'post',
	url:'https://api.github.com/repos/thk-code-arch/intercom-frontend/issues?state=all',
	headers: headersOpt,
	json: { title: req.body.title, body: req.body.context, labels: [ req.body.label ] }
  }, function (error, response, body) {
	if (error) {
	  console.error(error)
	  res.status(200).send("error",response);
	  return
	}
	console.log(`statusCode: ${res.statusCode}`);
	console.log(body);
	res.status(200).send(body);
  });

};
