const {Client} = require('pg')
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
    host: process.env.HOST,
    port:  process.env.PORT,
    user: process.env.USER,
    password:  process.env.PASSWORD,
    database:  process.env.DATABASE
    
})



async function main(){
    const newbooks = await prisma.books.findMany()
   console.log(newbooks)
}


main().catch(e=> {
        console.error(e.message)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

module.exports =  client;