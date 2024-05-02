const mysql = require('mysql');
const bcrypt = require('bcrypt');

const conn = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '12345678',
    database: 'display'
});

conn.connect((err) => {
    if (err) console.log(err);
    else console.log('Connected to the database');
});

// 사용자 정보 삽입 함수
function insertUser() {
    const saltRounds = 10;
    const username = 'admin';
    const password = "1234";
    const hashed = bcrypt.hashSync(password, saltRounds);
    console.log(hashed);

    console.log(bcrypt.compareSync(password, hashed));

    const query = 'INSERT INTO account (id, password) VALUES (?, ?)';
    conn.query(query, [username, hashed], (error, results, fields) => {
        if (error) {
            console.error('Error inserting user:', error);
            return;
        }
        console.log('User inserted successfully');
    });
}


// insertUser();

module.exports = conn;