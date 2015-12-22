var bcrypt       = require('bcrypt');
var mysql        = require('mysql');
var dotEnv       = require('dot-env');

module.exports   = {
    verify: function(req, done) {
        var connection = mysql.createConnection({
            socket   : process.env.DB_SOCKET,
            user     : process.env.DB_USER,
            password : process.env.DB_PASSWORD,
            database : process.env.DB_DATABASE
        });
        connection.connect(function(err) {
            if (err) done(err);
        });
        connection.query('SELECT password FROM users WHERE email = \''+req.body.email+'\'', function(err, result, fields) {
            if (err) done(err);
            if (!result || !result[0] || !result[0].password) return done(null, false);

            var password = result[0].password.replace('$2y$', '$2a$');
            var salt = password.slice(0,29);
            bcrypt.hash(req.body.password, salt, function(err, enc) {
                if (err) {
                    console.log(err);
                    return done(err, null);
                } else if (enc == password) {
                    // console.log('Authorized');
                    return done(null, true);
                } else {
                    // console.log('Not Authorized');
                    return done(null, null);
                }
            });
        });

        connection.end();
    },
    clientLookup(client_id): function(client_id) {
        return 'http://xkcd.leviolson.com';
    }
};
