const express = require('express')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectID
const app = express()
const port = 5055
require('dotenv').config()

app.use(express.json())
app.use(cors())

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("safaLeather").collection("product");
    const orderCollection = client.db("safaLeather").collection("order");

    app.post('/addProduct', (req, res) => {
        collection.insertOne(req.body)
            .then(result => {
                console.log(result)
                res.json(result.insertedCount > 0)
                res.redirect('/')
            })
    })

    app.get('/allProduct', (req, res) => {
        collection.find({})
            .toArray((err, result) => {
                res.json(result)
            })
    })

    app.get('/orders/:id', (req, res) => {
        console.log(req.params.id)

        collection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, result) => {
                console.log(result)
                res.json(result)
            })
    })

    app.post('/orderBy', (req, res) => {
        const order = req.body
        orderCollection.insertOne(order)
            .then(result => {
                console.log(result)
                res.json(result.insertedCount > 0)
            })
    })

    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id)
        collection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((err, result) => {
                console.log(result)
                res.json(result.deletedCount > 0)
            })
    })
});


app.get('/', (req, res) => {
    res.send('Server Host Successfully')
})

app.listen(process.env.PORT || port)