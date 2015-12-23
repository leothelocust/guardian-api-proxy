var bcrypt       = require('bcrypt');
var mysql        = require('mysql');
var dotEnv       = require('dot-env');

module.exports.DatabaseLookup = function(req, done) {
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
    };
module.exports.ClientLookup = function(client_id, done) {
    this.client_id = client_id;
    console.log(this.client_id);
    var connection = mysql.createConnection({
        socket   : process.env.DB_SOCKET,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DATABASE
    });
    connection.connect(function(err) {
        if (err) return done(err, false);
    });
    connection.query('SELECT url FROM clients WHERE client_id = \''+this.client_id+'\'', function(err, result, fields) {
        if (err) return done(err, false);
        if (!result || !result[0] || !result[0].url) return done(null, false);
        console.log(result[0].url);
        return done(null, result[0].url);
    });

    connection.end();
};
