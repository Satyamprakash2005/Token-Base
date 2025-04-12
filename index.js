const express = require("express");
const zod = require("zod");
const getClient = require("./db");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const authMiddleware=require("./middleware")
const dotenv=require("dotenv");

dotenv.config();

const app = express()
app.use(express.json());

const signupSchema = zod.object({
    email: zod.string(),
    password: zod.string(),
});
const loginSchema = zod.object({
    email: zod.string(),
    password: zod.string(),
});

app.post("/signup", async (req, res) => {

    const data = req.body;

    const zodResult = signupSchema.safeParse(data);
    if (!zodResult.success) {
        return res.json({
            message: "invalid input",
        })
    }

    const client = await getClient();

    const result = await client.query("SELECT * FROM users WHERE email=$1", [
        data.email,
    ]);

    if (result.rowCount > 0) {
        return res.json({
            message: "email already exists",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    await client.query("INSERT INTO USERS VALUES($1,$2)", [
        data.email,
        hashedPassword,
    ]);

    console.log(data);

    return res.json({
        message: "working",
    });
});

app.post("/login", async (req, res) => {
    const data = req.body;

    const client = await getClient();

    const result = await client.query("SELECT * FROM users WHERE email=$1", [
        data.email
    ]);

    if (result.rowCount === 0) {
        return res.json({
            message: "user not register",
        });
    }

    const correctPassword = await bcrypt.compare(data.password, result.rows[0].password);

    console.log(correctPassword);

    if (correctPassword) {
        const token=jwt.sign({email:data.email},process.env.JWT_SECRET);
        return res.json({
            message: "login success",
            token:token,
        });
    }
    else{
        return res.json({
            message: "incorrect password",
        });
    }
});

app.get("/profile",authMiddleware,(req,res)=>{
    return res.json({
        email:req.email,
        data:"profile details",
    });
});

app.listen(8080, () => {
    console.log("server is running on port 8080");
});