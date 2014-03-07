var geoip = require('geoip-lite');

var geolocation = {};

geolocation.getLocation = function(ip) {

    var geo = geoip.lookup(ip);

    //  console.log(geo);

    //  { range: [ 3479299040, 3479299071 ],
    //    country: 'US',
    //    region: 'CA',
    //    city: 'San Francisco',
    //    ll: [37.7484, -122.4156] }

    return geo;
};

module.exports = geolocation;
