const express = require('express');
const app = express();
const port = 3001; // Can be any port that doesn't conflict with your React app

app.use(express.json()); // For parsing application/json

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/database.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = `SELECT * FROM Users WHERE email = ? AND password = ?`;

    db.get(sql, [email, password], (err, row) => {
        if (err) {
            res.status(400).send({ error: err.message });
            return;
        }
        if (row) {
            // User found
            res.send({ user: row, userType: row.boolTeacher ? 'Teacher' : 'Student' });
        } else {
            // User not found
            res.status(404).send({ message: 'User not found' });
        }
    });
});
