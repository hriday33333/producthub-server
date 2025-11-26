const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gisrno5.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db('producthub');
    const productsCollection = db.collection('products');

  
    app.get('/products', async (req, res) => {
      try {
        const products = await productsCollection.find().toArray();
        res.send(products);
      } catch (error) {
        res.status(500).send({ message: 'Failed to fetch products', error });
      }
    });

    // POST a new product
    app.post('/products', async (req, res) => {
      try {
        const product = req.body;
        const result = await productsCollection.insertOne(product);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Failed to add product', error });
      }
    });

    // DELETE a product by ID
    app.delete('/products/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const { ObjectId } = require('mongodb');

        const result = await productsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Failed to delete product', error });
      }
    });

    // Ping test
    await client.db('admin').command({ ping: 1 });
    console.log('MongoDB connected successfully!');
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!gggggggg');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
