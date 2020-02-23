var express = require('express');
const app = express();
const bodyParser = require('body-parser')

// require files
const dataStoreRoute = require('./route/data-store')
const { handleError } = require('./helper/error')

// parse various input types in req-body
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.raw({limit: '5mb'}) );

app.get('/', function (req, res) {
   res.send('Local Data Store');
})

app.use('/api/v1', dataStoreRoute);

app.use((err, req, res, next) => {
   handleError(err, res);
});

var server = app.listen(process.env.PORT || 3000, function () {
   var host = process.env.HOST || 'localhost';
   var port = server.address().port;
   
   console.log("Example app listening at http://%s:%s", host, port)
})