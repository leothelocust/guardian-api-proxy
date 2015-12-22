var bodyParser   = require('body-parser');
var express      = require('express');
var passport     = require('passport');
var Strategy     = require('passport-custom').Strategy;
var request      = require('request');
var dotEnv       = require('dot-env');
var db           = require('./database.js');

var app          = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(passport.initialize());

// Custom Strategy
passport.use(new Strategy(db.verify));

// Use Custom Strategy
app.use('*', passport.authenticate('custom', { session: false }));

// Main Route /
app.all('*', function(req, res, next) {
    // TODO: lookup base url based on client_id in request body
    var baseUrl = clientLookup(req.body.client_id);

    // Perform the actual request to the requested API
    request(
        {
            method    : req.body._method || req.method,
            uri       : baseUrl + req.path,
            multipart : [{
                'content-type' : 'application/json',
                'body'         : JSON.stringify(req.body.params) || ''
            }]
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var request = {
                    "baseUrl"       : baseUrl,
                    "body"          : req.body,
                    "method"        : req.method,
                    "requestParams" : req.body.params,
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
                console.log('Error code    : ' + response.statusCode);
                console.log('Error message : ' + error);
            }
        });
});

var port = process.env.PORT;

app.listen(port, '127.0.0.1', function () {
    console.log('Example app listening at http://%s:%s', '127.0.0.1', port);
});
