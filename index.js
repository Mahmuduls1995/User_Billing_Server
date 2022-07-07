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


        app.post('/api/login', async (req, res) => {
            const user = req.body;
            console.log(user);
            if (user) {
                const exist = await userCollection.findOne({ email: user.email, password: user.password })
                if (exist) {
                    const token = jwt.sign({ email: user.email }, process.env.ACCESS_SECRET, { expiresIn: '1d' })
                    res.status(200).send({ success: true, token })
                } else {
                    res.send({ error: true, message: 'email or password does not match' })
                }
            }

        });

        app.post('/api/registration', async (req, res) => {
            const user = req.body;
            const exist = await userCollection.findOne({ email: user.email })
            if (!exist) {
                const result = await userCollection.insertOne(user);
                res.status(201).send({ result })
            } else {
                res.send({ user: user.email, message: "User already exist" })
            }
        });


        

    } finally {

    }
}
run().catch(console.dir);









app.get('/', (req, res) => {
    res.send("Billing server");
});

app.listen(port, () => console.log('Server Running port: ', port));
