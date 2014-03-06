var mysql = require('mysql');                           // mysql module

var db = {};

var connection = undefined;

db.connect = function (hostParam, userParam, passwordParam) {

    connection = mysql.createConnection({
        host: hostParam,
        user: userParam,
        password: passwordParam
    })

    connection.connect(function (err) {
        if (err) console.log(err)
    })

    connection.query('CREATE DATABASE IF NOT EXISTS survey', function (err) {
        if (err) throw err;
        connection.query('USE survey', function (err) {
            if (err) throw err;
            connection.query('CREATE TABLE IF NOT EXISTS beers('
                + 'id INT NOT NULL AUTO_INCREMENT,'
                + 'PRIMARY KEY(id),'
                + 'name VARCHAR(30) NOT NULL UNIQUE,'
                + 'region VARCHAR(30)'
                + ')', function (err) {
                if (err) throw err;
                connection.query('CREATE TABLE IF NOT EXISTS votes('
                    + 'id INT NOT NULL AUTO_INCREMENT,'
                    + 'PRIMARY KEY(id),'
                    + 'beer_id INT NOT NULL'
                    + ')', function (err) {
                    if (err) throw err;
                    connection.query('INSERT IGNORE INTO beers (name, region) VALUES (\'Corona\',\'Mexico\')', function (err) {
                        if (err) throw err;
                        connection.query('INSERT IGNORE INTO beers (name, region) VALUES (\'Dos Equis\',\'Mexico\')', function (err) {
                            if (err) throw err;
                            connection.query('INSERT IGNORE INTO beers (name, region) VALUES (\'Pacifico\',\'Mexico\')', function (err) {
                                if (err) throw err;
                                connection.query('INSERT IGNORE INTO beers (name, region) VALUES (\'Stella Artois\',\'Belgium\')', function (err) {
                                    if (err) throw err;
                                    connection.query('INSERT IGNORE INTO beers (name, region) VALUES (\'Hoegaarden\',\'Belgium\')', function (err) {
                                        if (err) throw err;
                                        connection.query('INSERT IGNORE INTO beers (name, region) VALUES (\'Palm\',\'Belgium\')', function (err) {
                                            if (err) throw err;
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    })
}

db.findBeers = function (callback) {

    connection.query('SELECT * FROM beers', function (err, rows, fields) {
        console.log('Connection result error ' + err);
        console.log('no of records is ' + rows.length);
        return callback(rows);
    });

}

db.findVotes = function (callback) {

    connection.query('SELECT b.region, COUNT(*) as votes FROM beers b, votes v WHERE b.id=v.beer_id GROUP BY b.region', function (err, rows, fields) {
        console.log('Connection result error ' + err);
        console.log('no of records is ' + rows.length);
        return callback(rows);
    });

}

db.insertItem = function (item, callback) {

    console.log('item to insert:' + item.text);

    connection.query('INSERT INTO votes SET ?', {beer_id: item.text}, function (err, result) {
        if (err) throw err;

        console.log(result.insertId);
    });

}

db.deleteItem = function (item, callback) {

    console.log('item to delete:' + item.id);

    connection.query('DELETE FROM beers WHERE id = ?', [item.id], function (err, result) {
        if (err) throw err;

        console.log('Rows deleted: ' + result.affectedRows);
    });

}


module.exports = db;