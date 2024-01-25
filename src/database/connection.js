const mysql = require("mysql2/promise");

//for production
const pool = mysql.createPool({
  host: "db-decesion-168.czkxgo85sren.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "Decesion_168",
  database: "decision168new",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: 3306,
});



pool
  .getConnection()
  .then((connection) => {
    console.log("Connected to MySQL database!");
    connection.release();
  })
  .catch((error) => {
    console.error("Error connecting to MySQL database:", error.message);
  });

module.exports = pool;
