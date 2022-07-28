const express = require('express')
const app = express()
const cors = require('cors')
// const products = require('./products')
require('dotenv').config()

const port = process.env.PORT || 5000

// middleware 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})
// app.get('/products', async (req, res) => {
//     res.send(products)
// })


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5eij1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db("bestBuy").collection("products");

        app.get('/products', async (req, res) => {
            const products = await productsCollection.find().toArray()
            console.log(products);
            if (req.query.name) {
                const search = req.query.name
                const matched = products.filter(product => product.name.toLocaleLowerCase().includes(search))
                res.send(matched)
            }
            else {
                const query = {}
                const cursor = productsCollection.find(query)
                const products = await cursor.toArray()
                res.send(products)
            }
        })
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})