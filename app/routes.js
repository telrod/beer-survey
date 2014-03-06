var db = require('./persistence/database');

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

        db.insertItem({text: req.body.id}, function (err, result) {
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