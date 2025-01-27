const mysql= require("mysql2");
require("dotenv").config();


const connections=mysql.createPool({
    host:process.env.DB_host,
    user:process.env.DB_user,
    password:process.env.DB_password,
    database:process.env.DB_database
});
const connection =connections.promise();
module.exports={connection};
