const {Client} = require("pg");
const dotenv=require("dotenv");

dotenv.config();

async function getClient(){
    const client=new Client(process.env.DB_URL
    );
    await client.connect();
    return client;
}

module.exports=getClient;