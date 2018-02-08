const express = require('express');
const router = express.Router();

router.access_controls = (req, res, next) => {
    // Website you wish to allow to connect
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
    const origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // res.setHeader('Access-Control-Allow-Origin', "*");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'enctype, origin, authorization,accept,X-Requested-With,content-type, x-access-token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Access-Control-Allow-Origin: *
    // Pass to next layer of middleware
    // if ('OPTIONS' === req.method) {
    //     res.send(200);
    // } else {
    //     next();
    // }
    next();
};

module.exports = router;