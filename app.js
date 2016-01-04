var bodyParser   = require('body-parser');
var express      = require('express');
var passport     = require('passport');
var Strategy     = require('passport-custom').Strategy;
var request      = require('request');
var dotEnv       = require('dot-env');
var DB           = require('./database.js');

var app          = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(passport.initialize());

// Custom Strategy
passport.use(new Strategy(DB.DatabaseLookup));
app.use('*', passport.authenticate('custom', { session: false }));

// Main Route /
app.all('*', function(req, res, next) {
    // Lookup client
    var baseUrl = DB.ClientLookup(req.body.client_id, function(err, url) {
        if (err) {
            console.log(err);
            return res.sendStatus(404);
        }
        if (!url) {
            console.log('No Results');
            return res.sendStatus(400);
        }

        // Perform request on API
        console.log(req.body._method);
        console.log(url);
        console.log(req.path);

        var method = req.body._method || req.method;
        request(
            {
                method    : method,
                uri       : url + req.path,
                multipart : [{
                    'content-type' : 'application/json',
                    'body'         : JSON.stringify(req.body.params) || ''
                }]
            },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var request = {
                        "ok"            : response.statusCode==200?true:false,
                        "baseUrl"       : url,
                        "body"          : req.body,
                        "method"        : method,
                        "ProxyRequest"  : req.body.params,
                        "originalUrl"   : req.originalUrl,
                        "path"          : req.path,
                        "protocol"      : req.protocol,
                        "query"         : req.query,
                        "secure"        : req.secure,
                        "signedCookies" : req.signedCookies,
                        "response"      : JSON.parse(body),
                    }
                    res.json(request);
                } else {
                    //console.log('Error code    : ' + response.statusCode);
                    console.log('Error message : ' + error);
                }
            }
        );
    });
});

var port = process.env.PORT;

app.listen(port, '127.0.0.1', function () {
    console.log('Example app listening at http://%s:%s', '127.0.0.1', port);
});
