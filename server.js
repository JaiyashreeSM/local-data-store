var express = require('express');
var app = express();
var router = express.Router();

// require files
var dataStoreRoute = require('./route/data-store')
const { handleError } = require('./helper/error')

app.get('/', function (req, res) {
   res.send('Local Data Store');
})

app.use('/api/v1', dataStoreRoute);

app.use((err, req, res, next) => {
   console.log(res)
   handleError(err, res);
});

var server = app.listen(process.env.PORT || 3000, function () {
   var host = process.env.HOST || 'localhost';
   var port = server.address().port;
   
   console.log("Example app listening at http://%s:%s", host, port)
})