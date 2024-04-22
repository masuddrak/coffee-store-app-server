const express = require('express')
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = 5000

// medilware
app.use(cors())
app.use(express.json())
// mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.MD_USER}:${process.env.MD_PASs}@cluster0.kaocfbi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const userCollection = client.db("coffeeDB").collection("user");
    // update coffee
    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id
      const coffee = await req.body
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: coffee.name,
          supplier: coffee.supplier,
          category: coffee.category,
          photo: coffee.photo,
          chef: coffee.chef,
          taste: coffee.taste,
          details: coffee.details
        },
      };
      const result = await databaseCollection.updateOne(filter, updateDoc, options);
      res.send(result)
      console.log(id)

    })
    // find a coffee
    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id
      console.log(id)
      const query = { _id: new ObjectId(id) };
      const result = await databaseCollection.findOne(query);
      res.send(result)
    })
    // delete single coffee
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await databaseCollection.deleteOne(query);
      res.send(result)
    })
    // all coffee
    app.get("/coffees", async (req, res) => {
      const cursor = databaseCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })
    // create coffee
    app.post("/coffees", async (req, res) => {
      const coffee = req.body
      const result = await databaseCollection.insertOne(coffee);
      res.send(result)
    })
    // user related collection
    // update user
    app.patch("/user",async(req,res)=>{
      const user=req.body
      const query={email:user.email}
      const updateDoc = {
        $set: {
          lastSignInTime:user.lastSignInTime
        },
      };
      const result = await userCollection.updateOne(query, updateDoc);
      res.send(result)
      console.log(user)
    })

    // delete user
    app.delete("/user/:id",async(req,res)=>{
      const id=req.params.id
      const query={_id:new ObjectId(id)}
      const result=await userCollection.deleteOne(query)
      res.send(result)
    })
    // read user all
    app.get("/user", async (req, res) => {
      const cursor=userCollection.find()
      const result=await cursor.toArray()
      res.send(result)
    })
    // create user info
    app.post("/user", async (req, res) => {
      const user = req.body
      const result = await userCollection.insertOne(user)
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