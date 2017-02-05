//TODO: check connectionString and change /omicron to your db you made the foodbase DB in postgres

var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';


//modules
var testModule = require('../modules/testModule.js');
console.log(testModule.test("\n\n\n\nfoodRoute.js: testing module connection"));


//AJAX requests:


// DELETE FROM DB
router.delete('/:id', function(req, res) {
    var id = req.params.id;
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
            console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in DELETE, pg.connect\n", err, "\n \n \n \n");
        }

        //To manage strings and refrences cleaner
        var refrenceValues = [id];
        var queryString = 'DELETE FROM foodbase WHERE id = $1';

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
        var queryStringGET = 'SELECT * FROM foodbase ORDER BY id ASC';

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
        var queryString = 'INSERT INTO foodbase (food_date, food_name, food_amount, food_place, food_category) VALUES ($1, $2, $3, $4, $5)';
        var refrenceValues = [item.item_date, item.item_name, (item.item_amount), item.item_place, item.item_category];


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
        var queryString = 'UPDATE foodbase SET food_date = $1, food_name = $2, food_amount = $3, food_place = $4 WHERE id = $5';
        var refrenceValues = [rowValue.food_date, rowValue.food_name, rowValue.food_amount, rowValue.food_place, id];

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
