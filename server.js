// Import some dependencies / packages

// HTTP framework for handling requests
const express = require('express');
// Instance of express framework
const app = express();
// DBMS Mysql
const mysql = require('mysql2');
// Cross Origin Resource Sharing
const cors = require('cors');
// Environment Variable Doc
const dotenv = require('dotenv');

// 
app.use(express.json());
app.use(cors());
dotenv.config();

// Connection to the Database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check if there is a connection
db.connect((err) => {
    // If no connection
    if(err) return console.log("Error connecting to MYSQL");

    // If connect works Successfully
    console.log("Connected to MYSQL as id:", db.threadId);
});

// 
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



// 1. Retrieve all patients
app.get('/data', (rq,res) => {
    db.query('SELECT * FROM patients', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error Retrieving data')
        }else {
            res.render('data', {results: results});
        }
    });
});

// 2. Retrieve all providers
app.get('/data', (rq,res) => {
    db.query('SELECT * FROM providers', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error Retrieving data')
        }else {
            res.render('data', {results: results});
        }
    });
});
  

  // 3. Filter patients by First Name
  app.get('/patients/:firstName', (req, res) => {
    const firstName = req.params.firstName;
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(query, [firstName], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
  });
  
  // 4. Retrieve all providers by their specialty
  app.get('/providers/specialty/:specialty', (req, res) => {
    const specialty = req.params.specialty;
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    db.query(query, [specialty], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
  });
  


// < Your code goes up there

// < Your code goes down here


// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);

    // Sending a message to the browser
    console.log('Sending message to browser...');
    app.get('/', (req,res) => {
        res.send('Server Started Successfully!');
    });

});



