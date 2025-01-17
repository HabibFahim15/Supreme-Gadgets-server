const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i5to1lc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productsCollection = client.db('SupremeGadgets').collection('products');

    app.get('/products', async(req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/products', async(req, res) => {
      console.log(req.body);
      const addedBike = await productsCollection.insertOne(req.body);
      res.send(addedBike);
    })
    app.get('/products/myProduct/:email', async(req, res) => {
      const result = await productsCollection.find({email: req.params.email}).toArray();
      res.send(result);
    })

    app.get('/products/:id', async(req, res) => {
      const result = await productsCollection.findOne({_id: new ObjectId(req.params.id)});
      console.log(result);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Supreme Gadgets server is running on: ${port}`)
})