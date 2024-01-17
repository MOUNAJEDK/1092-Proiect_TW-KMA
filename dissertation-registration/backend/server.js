const express = require('express');
const cors = require('cors');
const path = require('path'); // Import the 'path' module
const app = express();
const port = 3001; // Can be any port that doesn't conflict with your React app
const multer = require('multer');

const storage = multer.diskStorage({
    destination: './uploads/', // Specify the directory where uploaded files will be stored
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Define the file name
    },
});
const upload = multer({ storage });

app.use(express.json()); // For parsing application/json
app.use(cors());

app.use('/static', express.static(path.join(__dirname, 'static')));

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
            res.send({
                user: row,
                userId: row.user_id, // Send the user ID
                userType: row.boolTeacher ? 'Teacher' : 'Student'
            });
        } else {
            // User not found
            res.status(404).send({ message: 'User not found' });
        }
    });
});

app.get('/available-teachers', (req, res) => {
    const sql = `
        SELECT t.teacher_id, u.Firstname, u.lastName
        FROM Teachers t
        JOIN Users u ON t.teacher_id = u.user_id
        WHERE u.boolTeacher = 1 AND (
          SELECT COUNT(*)
          FROM StudentTeacherRequests str
          WHERE str.teacher_id = t.teacher_id
          AND str.status = 'approved'
        ) < t.max_students
        AND t.teacher_id NOT IN (
          SELECT teacher_id 
          FROM StudentTeacherRequests 
          WHERE status = 'pending'
        );
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }
        res.send(rows);
    });
});


app.post('/request-teacher', (req, res) => {
    const { studentId, teacherId } = req.body;
    console.log(`Received studentId: ${studentId}, teacherId: ${teacherId}`);
    const sql = `INSERT INTO StudentTeacherRequests (student_id, teacher_id, status) VALUES (?, ?, 'pending')`;
    db.run(sql, [
        studentId, teacherId], function (err) {
            if (err) {
                res.status(500).send({ error: err.message });
                return;
            }
            res.send({ message: 'Request sent successfully', requestId: this.lastID });
        });
});

app.get('/student-assigned/:studentId', (req, res) => {
    const { studentId } = req.params;
    const sql = `
        SELECT EXISTS(
            SELECT 1 FROM StudentTeacherRequests
            WHERE student_id = ?
            AND status = 'approved'
        ) AS isAssigned;
    `;

    db.get(sql, [studentId], (err, row) => {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }
        res.send({ isAssigned: row.isAssigned === 1 });
    });
});

// Endpoint to get pending requests for a specific teacher
app.get('/pending-requests/:teacherId', (req, res) => {
    const { teacherId } = req.params;
    const sql = `
      SELECT str.request_id, s.user_id as student_id, s.Firstname || ' ' || s.lastName as student_name
      FROM StudentTeacherRequests str
      JOIN Users s ON str.student_id = s.user_id
      WHERE str.teacher_id = ? AND str.status = 'pending'
    `;
    db.all(sql, [teacherId], (err, rows) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            console.log(`Pending requests for teacher ${teacherId}:`, rows);
            res.send(rows);
        }
    });
});

// Endpoint to get accepted requests for a specific teacher
app.get('/accepted-requests/:teacherId', (req, res) => {
    const { teacherId } = req.params;
    const sql = `
      SELECT str.request_id, s.user_id as student_id, s.Firstname || ' ' || s.lastName as student_name
      FROM StudentTeacherRequests str
      JOIN Users s ON str.student_id = s.user_id
      WHERE str.teacher_id = ? AND str.status = 'approved'
    `;
    db.all(sql, [teacherId], (err, rows) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.send(rows);
        }
    });
});

// Endpoint to accept a request
app.post('/accept-request', (req, res) => {
    const { requestId } = req.body;
    const updateSql = `
      UPDATE StudentTeacherRequests
      SET status = 'approved'
      WHERE request_id = ?
    `;

    db.run(updateSql, [requestId], function (err) {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }

        // After updating, fetch the accepted request data to return it
        const fetchSql = `
        SELECT str.request_id, s.user_id as student_id, s.Firstname || ' ' || s.lastName as student_name
        FROM StudentTeacherRequests str
        JOIN Users s ON str.student_id = s.user_id
        WHERE str.request_id = ?
      `;

        db.get(fetchSql, [requestId], (fetchErr, row) => {
            if (fetchErr) {
                res.status(500).send({ error: fetchErr.message });
            } else {
                res.send({ message: 'Request accepted', acceptedRequest: row });
            }
        });
    });
});

// Endpoint to deny a request
app.post('/deny-request', (req, res) => {
    const { requestId } = req.body;
    const sql = `
      UPDATE StudentTeacherRequests
      SET status = 'denied'
      WHERE request_id = ?
    `;
    db.run(sql, [requestId], function (err) {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.send({ message: 'Request denied' });
        }
    });
});

// Endpoint for uploading files
app.post('/upload-file', upload.single('file'), (req, res) => {
    const { studentId } = req.body;
    const filePath = req.file.path; // Get the path of the uploaded file
  
    // Store the file path in the database, associating it with the student
    const insertSql = `INSERT INTO StudentFiles (student_id, file_path) VALUES (?, ?)`;
    db.run(insertSql, [studentId, filePath], (err) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send({ message: 'File uploaded successfully' });
      }
    });
});

// Endpoint for retrieving the file path associated with a student
app.get('/get-file/:studentId', (req, res) => {
    const { studentId } = req.params;
    const sql = `SELECT file_path FROM StudentFiles WHERE student_id = ?`;
  
    db.get(sql, [studentId], (err, row) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else if (row) {
        res.sendFile(row.file_path); // Send the file associated with the student
      } else {
        res.status(404).send({ message: 'File not found for this student' });
      }
    });
});