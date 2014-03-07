var mysql = require('mysql');                           // mysql module
var csv = require('csv');
var fs = require('fs');

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
                    + 'country VARCHAR(250),'
                    + 'ip VARCHAR(20),'
                    + 'PRIMARY KEY(id),'
                    + 'beer_id INT NOT NULL'
                    + ')', function (err) {
                    if (err) throw err;
                    loadBeers();
                });
            });
        });
    })
}

loadBeers = function () {
    console.log('Loading beers');

    var __filename = './app/persistence/beers.csv';
    csv().from.stream(fs.createReadStream(__filename)).transform(function (row) {
        row.unshift(row.pop());
        return row;
    })
        .on('record', function (row, index) {

            var name = row[1];
            var region = row[0];

            if (index == 0) {
                if (name == 'name' && region == 'region') {
                    console.log('Correct header found, skipping..');
                }
                else {
                    console.log('Correct header not found, should have name and region as header');
                }
            }
            else {
                console.log('Inserting beer: ' + name + ' with region: ' + region)
                connection.query('INSERT IGNORE INTO beers (name, region) VALUES (\'' + name + '\',\'' + region + '\')', function (err) {
                    if (err) throw err;
                });
            }
        })
        .on('end', function (count) {
            console.log('Number of lines: ' + count);
        })
        .on('error', function (error) {
            console.log(error.message);
        });
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

db.insertItem = function (item, country, ip, callback) {

    console.log('item to insert:' + item.text);

    connection.query('INSERT INTO votes (beer_id, country, ip) VALUES(?,?,?)', [item.text,country, ip], function (err, result) {
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