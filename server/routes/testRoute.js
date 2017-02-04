//TODO: check connectionString and change /omicron to your db you made the testbase DB in postgres

var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';


//modules
var testModule = require('../modules/testModule.js');
console.log(testModule.test("\n\n\n\ntestRoute.js: testing module connection"));


//AJAX requests:


// DELETE FROM DB
router.delete('/:id', function(req, res) {
    var id = req.params.id;
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
            console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in DELTE, pg.connect\n", err, "\n \n \n \n");
        }

        //To manage strings and refrences cleaner
        var refrenceValues = [id];
        var queryString = 'DELETE FROM testbase WHERE id = $1';

        client.query(queryString, refrenceValues,
            function(err, result) {
                done();
                if (err) {
                    console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in DELETE, client.query: ", err, "\n \n \n \n");
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(200);
            });
    });
});




// GET FROM DB
router.get('/', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
            console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in GET, pg.connect", err, "\n \n \n \n");
        }

        //To manage strings and refrences cleaner
        // might eventually want to order by DESC so that new items show up at top of table
        // to_char(item_date,'mm/dd/yy') AS item_date
        var queryStringGET = 'SELECT * FROM testbase ORDER BY id ASC';

        client.query(queryStringGET,
            function(err, result) {
                done(); //closes connection, I only can have ten :(
                if (err) {
                    res.sendStatus(500);
                    console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in GET, client.query: ", err, "\n \n \n \n");
                    return;
                }
                res.send(result.rows);
            });
    });
});







// POST TO DB
router.post('/', function(req, res) {
    var item = req.body;

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
            console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in POST, pg.connect", err, "\n \n \n \n");
        }

        //To manage strings and refrences cleaner
        var queryString = 'INSERT INTO testbase (item_date, item_name, item_amount, item_place) VALUES ($1, $2, $3, $4)';
        var refrenceValues = [item.item_date, item.item_name, (item.item_amount), item.item_place];


        client.query(queryString, refrenceValues,

            function(err, result) {
                done();
                if (err) {
                    res.sendStatus(500);
                    console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in POST, client.query: ", err, "\n \n \n \n");
                    return;
                }
                res.send(result.rows);
            });
    });
});








// PUT INTO DB, UPDATE
router.put('/:id', function(req, res) {
    var id = req.params.id;
    var rowValue = req.body;

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in PUT, pg.connect", err, "\n \n \n \n");
            res.sendStatus(500);
        }

        //To manage strings and refrences cleaner
        var queryString = 'UPDATE testbase SET item_date = $1, item_name = $2, item_amount = $3, item_place = $4 WHERE id = $5';
        var refrenceValues = [rowValue.item_date, rowValue.item_name, rowValue.item_amount, rowValue.item_place, id];

        client.query(queryString, refrenceValues,

            function(err, result) {
                done();
                if (err) {
                    res.sendStatus(500);
                    console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in PUT, client.query: ", err, "\n \n \n \n");
                    return;
                }
                res.sendStatus(200);

            });

    });

});



module.exports = router;
