//Build Template

//TODO: run contents of file db.sql this in postgres
//TODO: change json title, desc, etc.
//TODO: npm install dependencies
//TODO: check /routes/testRoute.js for additional settup



var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

app.use(bodyParser.urlencoded({
    extended: true
}));



//modules
var testModule = require("./modules/testModule.js");
console.log(testModule.test("app.js: testing module connection"));



//routes
var foodRoute = require("./routes/foodRoute.js");
app.use('/foodRoute', foodRoute);

var budgetRoute = require("./routes/budgetRoute.js");
app.use('/budgetRoute', budgetRoute);


app.get('/*', function(req, res) {
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, './public', file));
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
    console.log('server is running on port', app.get('port'));

});
