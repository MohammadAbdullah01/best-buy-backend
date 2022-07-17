const express = require('express')
const app = express()
const cors = require('cors')
const products = require('./products')




const port = process.env.PORT || 5000

// middleware 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/products', async (req, res) => {
    res.send(products)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})