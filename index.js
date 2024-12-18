const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eedxn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        const reviewCollections = client.db('chill-gamersDB').collection('reviews')
        const watchListCollections = client.db('chill-gamersDB').collection('watchLists')
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });

        app.post('/reviews', async (req, res) => {
            const addNewReview = req.body;
            const result = await reviewCollections.insertOne(addNewReview);
            res.send(result)
        })

        app.post('/watchLists', async (req, res) => {
            const addNewWatchList = req.body;
            const result = await watchListCollections.insertOne(addNewWatchList);
            res.send(result)
        })
        app.get('/watchLists', async (req, res) => {
            const cursor = watchListCollections.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollections.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await reviewCollections.findOne(query)
            res.send(result)
        })

        app.get('/explore-details', async (req, res) => {
            const cursor = reviewCollections.find().limit(6)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/explore-details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await reviewCollections.findOne(query)
            res.send(result)
        })
        app.get('/my-reviews', async (req, res) => {
            const cursor = reviewCollections.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/my-reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await reviewCollections.findOne(query)
            res.send(result)
        })

        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const updateMyReview = {
                $set: {
                    coverUrl: req.body.coverUrl,
                    title: req.body.title,
                    description: req.body.description,
                    rating: req.body.rating,
                    year: req.body.year,
                    genre: req.body.genre,
                    name: req.body?.displayName,
                    email: req.body?.email,
                }
            }
            const result = await reviewCollections.updateOne(query, updateMyReview)
            res.send(result)
        })

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await reviewCollections.deleteOne(query)
            res.send(result)
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
    res.send("chill gamer server running")
})

app.listen(port, () => {
    console.log(`chill gamer server running port on ${port}`)
})