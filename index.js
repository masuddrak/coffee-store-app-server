const express = require('express')
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = 5000

// medilware
app.use(cors())
app.use(express.json())
// mongodb
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MD_USER}:${process.env.MD_PASs}@cluster0.kaocfbi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    const databaseCollection = client.db("coffeeDB").collection("coffee");
    app.post("/coffees",async(req,res)=>{
      const coffee=req.body
      const result = await databaseCollection.insertOne(coffee);
      res.send(result)
    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})