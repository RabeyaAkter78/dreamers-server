const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// midleware:
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hwapsgs.mongodb.net/?retryWrites=true&w=majority`;

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

        const database = client.db("dreamers-station")
        const collegeCollection = database.collection("dreamers");

        app.get("/allCollege", async (req, res) => {
            const result = await collegeCollection.find().toArray([]);
            res.send(result);
        })

        // for search:
        app.get('/searchCollege/:text', async (req, res) => {
            const searchText = req.params.text;
            const result = await collegeCollection.find({
                $or: [
                    { name: { $regex: searchText, $options: "i" } },
                    { category: { $regex: searchText, $options: "i" } }
                ],
            }).toArray();
            res.send(result);

        })

        // for add college:
        app.post("/addCollege", async (req, res) => {
            const colleges = req.body;
            
            const result = await collegeCollection.insertOne(colleges);
            console.log(colleges);
            res.send(result)
        });

        // for my college:
        app.get("/myCollege", async (req, res) => {
            const email = req.query.email;
            console.log(email)
            const result = await collegeCollection.find({ email: email }).toArray();
            res.send(result);
        })


        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

















app.get('/', (req, res) => {
    res.send('port is running');
})

app.listen(port, () => {
    console.log(`port  is running on port: ${port}`);

})