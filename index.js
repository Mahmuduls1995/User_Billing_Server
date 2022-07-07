const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');


// middleware

const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const verifyToken = (req, res, next) => {
    const authHeader = req.headers?.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: "unauthorized accesss" });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        } else {
            req.decoded = decoded;
            next()
        }
    })
}


const run = async () => {
    try {

        const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g697s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

        await client.connect();
        console.log('db connected');

        const userCollection = client.db('billing_system').collection('users');
        const billCollection = client.db('billing_system').collection('billing-list');


       

    } finally {

    }
}
run().catch(console.dir);









app.get('/', (req, res) => {
    res.send("Billing server");
});

app.listen(port, () => console.log('Server Running port: ', port));