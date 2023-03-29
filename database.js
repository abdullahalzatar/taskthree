const {Client} = require('pg')

const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
    host: process.env.HOST,
    port:  process.env.PORT,
    user: process.env.USER,
    password:  process.env.PASSWORD,
    database:  process.env.DATABASE
    
})


const execute = async (query) => {
    try {
        await client.connect()
        .then(() => console.log("Connected successfuly"))
        .catch(e => console.log(e));     
        await client.query(query)
        .then(() => client.query("select * from Books "))
        .then(results => console.table(results.rows));  
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    } 
};

const text = `
    CREATE TABLE IF NOT EXISTS "Books" (
	    "id" SERIAL,
	    "name" VARCHAR(100) NOT NULL,
	    PRIMARY KEY ("id")
    );`;

execute(text).then(result => {
    if (result) {
        console.log('Table created');
    }
});

module.exports = client;