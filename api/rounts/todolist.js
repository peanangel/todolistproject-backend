const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const mergeJSON = require("merge-json");

const pool = require('../../dbcon');



//get to do list by user id
router.get('/list/:userId', (req, res) => {
    let id = req.params.userId;

    let sql = 'SELECT * from todolist where user_id = ?';
    sql = mysql.format(sql, [id]);


    pool.query(sql, (error, results, fields) => {
        if (error) throw error;
        res.status(200).json({ message: 'successful', list: results });
      
    });

});


// router.get('/:cusId', (req, res) => {
//     let id = req.params.cusId;

//     pool.query('SELECT * from customer where id = ' + id, (error, results, fields) => {
//         if (error) throw error;
//         res.status(200).json(results);
//     });

// });

router.post('/', (req, res) => {
    let data = req.body;
    let sql = "INSERT INTO `todolist`(`title`, `description`, `is_completed` ) VALUES (?,?,?)";
    sql = mysql.format(sql, [data.title, data.description, data.is_completed,]);
    pool.query(sql, (error, results, fields) => {
        if (error) throw error;
        if (results.affectedRows == 1) {
            res.status(201).json({ message: 'Insert success' });
        } else {
            res.status(400).json({ message: 'Insert failed' });
        }
    });

});

router.delete('/:id', (req, res) => {
    let id = req.params.id;

    let sql = "DELETE FROM `todolist` WHERE id = ?"
    sql = mysql.format(sql, [id]);

    pool.query(sql, (error, results, fields) => {
        if (error) throw error;
        if (results.affectedRows == 1) {
            res.status(200).json({ message: 'Delete success' });
        } else {
            res.status(400).json({ message: 'Delete failed' });
        }

    });

});

// router.put('/:id', (req, res) => {
//     let id = req.params.cusId;
//     let data = req.body;
//     let sql = "update `customer` set firstname = ?, lastname = ?, email = ? where id = ?"
//     sql = mysql.format(sql, [data.firstname, data.lastname, data.email, id]);

//     pool.query(sql, (error, results, fields) => {
//         if (error) throw error;
//         if (results.affectedRows == 1) {
//             res.status(200).json({ message: 'Update success' });
//         } else {
//             res.status(400).json({ message: 'Update failed' });
//         }

//     });

// });


//Update data flexible
router.put('/update/:id', (req, res) => {
    let id = req.params.id;
    let data = req.body;
    let jsonOldData;

    //Query old data
    let oldSql = 'select * from todolist where id = ?';
    oldSql = mysql.format(oldSql, [id]);
    pool.query(oldSql, (error, results, fields) => {
        let oldData = results[0];
        jsonOldData = JSON.parse(JSON.stringify(oldData));
        //Update object data
        let newData = mergeJSON.merge(jsonOldData, data);
        console.log(jsonOldData);
        console.log(data);
        console.log(newData);


        //Save into database

        let sql = "update todolist set title = ?, description = ?, is_completed = ? where id = ?"
        sql = mysql.format(sql, [newData.title, newData.description, newData.is_completed, id]);

        pool.query(sql, (error, results, fields) => {
            if (error) throw error;
            if (results.affectedRows == 1) {
                res.status(200).json({ message: 'Update success' });
            } else {
                res.status(400).json({ message: 'Update failed' });
            }

        });
    });
});

//Update is complete
router.put('/iscompleted/:id', (req, res) => {

    let id = req.params.id;
    let data = req.body;
    let jsonOldData;

    //Query old data
    let oldSql = 'select is_completed from todolist where id = ?';
    oldSql = mysql.format(oldSql, [id]);


    pool.query(oldSql, (error, results, fields) => {
        let currentStatus = results[0].is_completed;
        let newStatus = currentStatus === 1 ? 0 : 1
        //Update object data
        let sql = 'update todolist set is_completed = ? where id = ?'
        sql = mysql.format(sql, [newStatus, id]);
        // console.log(jsonOldData);
        console.log(currentStatus);
        console.log(newStatus);
        //Save into database
        pool.query(sql, (error, results, fields) => {
            if (error) throw error;
            if (results.affectedRows == 1) {
                res.status(200).json({ message: 'Update is_completed success' });
            } else {
                res.status(400).json({ message: 'Update is_completed failed' });
            }

        });
    });
});



router.get('/notcompleted', (req, res) => {

    pool.query('SELECT * from todolist where is_completed = 0', (error, results, fields) => {
        if (error) throw error;
        res.status(200).json(results);
    });

});

router.get('/completed', (req, res) => {

    pool.query('SELECT * from todolist where is_completed = 1', (error, results, fields) => {
        if (error) throw error;
        res.status(200).json(results);
    });

});

module.exports = router;