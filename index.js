const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.SERVER_PORT || 5000
const uri = process.env.MONGODB_URI

app.use(cors());
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});
async function run() {
  try {
    await client.connect();
    const database = client.db("knowledgehub");
    const bookcollection = database.collection("books")

    //Books releted 
app.post("/api/books",async(req,res)=>{
  const book = req.body
  const newBook ={
    ...book,
    createdAt : new Date()
  }
  const result = await bookcollection.insertOne(newBook)
  res.send(result)
})

app.get("/api/books", async (req, res) => {
  const query = {};
  
  if (req.query.librarianId) {
    query.librarianId = req.query.librarianId;
  }
  
  const result = await bookcollection.find(query).toArray();
  res.send(result || []); 
});

//browse er jonno data get
app.get("/api/all/books", async (req, res) => {
    const query = {
      approvalStatus: "approved",
      publishStatus: "published",
    };

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { author: { $regex: req.query.search, $options: "i" } },
        { category: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.category && req.query.category !== "All") {
      query.category = req.query.category;
    }
    if (req.query.page) {
        const page = req.query.page;
        const perPage = req.query.perPage || 12;
        const skipItems = (page - 1) * perPage

        const total = await bookcollection.countDocuments(query);
        const cursor = bookcollection.find(query).skip(skipItems).limit(perPage);
        const books = await cursor.toArray();
        return res.send({ total, books });
    }

    app.get("/api/book/:id",async(req,res)=>{
      const id = req.params.id
      const query ={
        _id : new ObjectId(id)
      }
      const result = await bookcollection.findOne(query)
      res.send(result)
    })
    
  const result = await bookcollection.find(query).toArray();
  res.send(result || []); 
});


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});