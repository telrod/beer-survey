var db = require('./persistence/database');
var geolocation = require('./geo/geolocation');

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all beers for survey
    app.get('/api/survey', function (req, res) {

        db.findBeers(function (beerRows) {
            console.log('beerRows: ' + beerRows);
            db.findVotes(function (voteRows) {
                console.log('voteRows: ' + voteRows);
                var beersJson = JSON.stringify(beerRows);
                console.log('beersJson: ' + beersJson);
                var votesJson = JSON.stringify(voteRows);
                console.log('votesJson: ' + votesJson);
                var responseJson = '[{"tally":' + votesJson + '},{"beers":' + beersJson + '}]';
                res.writeHead(200, { 'Content-Type': 'application/json'});
                res.end(responseJson);
            })
        })
    });

    // create vote and send back all beers and vote tally after creation
    app.post('/api/vote', function (req, res) {

        remote_ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        if('127.0.0.1' === remote_ip) {
            remote_ip = '74.205.43.156';
        }
        geo = geolocation.getLocation(remote_ip);
        //console.log(geo);
        var country;
        if (typeof geo === "undefined") {
           country = "Unknown";
        } else {
         country = geo.country;
        }

        db.insertItem({text: req.body.id}, country, remote_ip, function (err, result) {
            if (err)
                res.send(err);

        })

        db.findBeers(function (beerRows) {
            console.log('beerRows: ' + beerRows);
            db.findVotes(function (voteRows) {
                console.log('voteRows: ' + voteRows);
                var beersJson = JSON.stringify(beerRows);
                console.log('beersJson: ' + beersJson);
                var votesJson = JSON.stringify(voteRows);
                console.log('votesJson: ' + votesJson);
                var responseJson = '[{"tally":' + votesJson + '},{"beers":' + beersJson + '}]';
                res.writeHead(200, { 'Content-Type': 'application/json'});
                res.end(responseJson);
            })
        })

    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};