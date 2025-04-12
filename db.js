const {Client} = require("pg");

async function getClient(){
    const client=new Client("postgresql://neondb_owner:npg_5CdSp6cMBijl@ep-snowy-unit-a5su6ve4-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
    );
    await client.connect();
    return client;
}

module.exports=getClient;