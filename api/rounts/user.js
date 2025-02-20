const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const mergeJSON = require("merge-json");
const bcrypt = require('bcrypt');

const pool = require('../../dbcon');



router.get('/user', (req, res) => {

    pool.query('SELECT * from user', (error, results, fields) => {
        if (error) throw error;
        res.status(200).json(results);
    });


});



//register
router.post('/user', async (req, res) => {
    try {
        let data = req.body;

        // Wait for hashed password before inserting into database
        const hashedPwd = await hashedPassword(data.password);

        let sql = "INSERT INTO `user`(`name`, `email`, `password`) VALUES (?, ?, ?)";
        sql = mysql.format(sql, [data.name, data.email, hashedPwd]);

        pool.query(sql, (error, results, fields) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).json({ message: 'Database error', error });
            }
            if (results.affectedRows === 1) {
                res.status(201).json({ message: true });
            } else {
                res.status(400).json({ message: false });
            }
        });

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



//login user
router.post('/user/login', async (req, res) => {
    try {
        let data = req.body;

        // Check if the user exists by email
        let sql = "SELECT * FROM `user` WHERE `email` = ?";
        sql = mysql.format(sql, [data.email]);

        pool.query(sql, async (error, results, fields) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).json({ message: 'Database error', error });
            }

            if (results.length === 0) {
                // User not found
                return res.status(404).json({ message: 'User not found' });
            }

            // Compare provided password with stored hashed password
            const isMatch = await bcrypt.compare(data.password, results[0].password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const user = { ...results[0] };
            delete user.password
            // Successful login
            res.status(200).json({ message: 'Login successful', user: user });
        });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// edit profile
router.post('/user/edit/:id', async (req, res) => {
    try {
        let data = req.body;

        // Check if the user exists by email
        let sql = "SELECT * FROM `user` WHERE `email` = ?";
        sql = mysql.format(sql, [data.email]);

        pool.query(sql, async (error, results, fields) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).json({ message: 'Database error', error });
            }

            if (results.length === 0) {
                // User not found
                return res.status(404).json({ message: 'User not found' });
            }

            // Compare provided password with stored hashed password
            const isMatch = await bcrypt.compare(data.password, results[0].password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const user = { ...results[0] };
            delete user.password
            // Successful login
            res.status(200).json({ message: 'Login successful', user: user });
        });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




// Hash password function (must be async)
async function hashedPassword(pwd) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pwd, salt);
}


module.exports = router;