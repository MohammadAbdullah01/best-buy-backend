const express = require('express')
const app = express()
const cors = require('cors')
// const products = require('./products')
require('dotenv').config()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5eij1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db("bestBuy").collection("products");
        const ordersCollection = client.db("bestBuy").collection("orders");

        //************************************************************************************** */
        // this is for my assignment project (todo-lws)
        //assignment 4
        const todoCollection = client.db("LWSAssignment").collection("todos");


        //************************************************************************************** */

        //get all products (mobile)
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

        //post order
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const orderComplete = await ordersCollection.insertOne(order)
            res.send(orderComplete)
        })
        //get all orders
        app.get('/orders', async (req, res) => {
            const result = await ordersCollection.find().toArray()
            res.send(result)
        })
        //get specific (email) order
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result = await ordersCollection.find(query).toArray()
            return res.send(result)
        })
        //delte one order with id
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query);
            res.send(result)
        })

        //************************************************************************************** */
        // this is for my assignment project (todo-lws)
        //assignment 4 
        //get all todos
        app.get('/todos', async (req, res) => {
            const todos = await todoCollection.find().toArray()
            res.send(todos)
        })
        //add todo
        app.post('/todos', async (req, res) => {
            const todo = req.body;
            const todoCompleted = await todoCollection.insertOne(todo)
            res.send(todoCompleted)
        })
        //delete one todo with id
        app.delete('/todos/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await todoCollection.deleteOne(query);
            res.send(result)
        })
        //update color
        app.put('/todos/color/:id', async (req, res) => {
            const updatedColor = req.body
            console.log(updatedColor);
            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    color: updatedColor.color
                }
            }
            const result = await todoCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })
        //update status
        app.put('/todos/status/:id', async (req, res) => {
            const updatedStatus = req.body
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    completed: updatedStatus.completed
                }
            }
            const result = await todoCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })
        //update text
        app.put('/todos/text/:id', async (req, res) => {
            const updatedText = req.body
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    text: updatedText.text
                }
            }
            const result = await todoCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })





        //***************************************************************************************** */



    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})