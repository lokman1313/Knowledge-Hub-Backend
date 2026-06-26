const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.SERVER_PORT || 5000;
const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
async function run() {
  try {
    await client.connect();
    const database = client.db("knowledgehub");
    const userCollection = database.collection("user");
    const sessionCollection = database.collection("session");
    const bookcollection = database.collection("books");
    const paymentCollection = database.collection("payments");
    const reviewCollection = database.collection("reviews");

    //verify token
    const verifyToken = async (req, res, next) => {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized access" });
      }
      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
      }
      const query = { token: token };
      const session = await sessionCollection.findOne(query);

      const userId = session.userId;

      const userQuery = {
        _id: userId,
      };
      const user = await userCollection.findOne(userQuery);
      if (!user) {
        return res.status(401).send({ message: "unauthorized access" });
      }
      req.user = user;
      next();
    };
const verifyUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  next();
};
const verifyLibrarian = (req, res, next) => {
  if (req.user.role !== "librarian") {
    return res.status(403).send({ message: "Forbidden" });
  }
  next();
};
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({ message: "Forbidden" });
  }
  next();
};
    //-----------for admins only------------------------------
    app.get("/api/all/users",verifyToken,verifyAdmin,async(req,res)=>{
      const result = await userCollection.find({}).sort({ createdAt: -1 }).toArray();
      res.send(result)
    })

    app.patch("/api/update/role/:id",verifyToken,verifyAdmin,async(req,res)=>{
      const id = req.params.id
      const updateData=req.body
      const query ={
        _id : new ObjectId(id)
      }
      const result = await userCollection.updateOne(query,{$set:updateData})
      res.send(result)
    })

    app.delete("/api/delete/user/:id",verifyToken,verifyAdmin,async(req,res)=>{
      const id = req.params.id
      const query ={
        _id : new ObjectId(id)
      }
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })

    app.get("/api/all/tranjections",verifyToken,verifyAdmin, async (req, res) => {
      const result = await paymentCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      res.send(result);
    });

    app.get("/api/pendingBooks",verifyToken,verifyAdmin, async (req, res) => {
      const query = { approvalStatus: "pending" };

      const result = await bookcollection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      res.send(result);
    });

    app.patch("/api/approveBooks/:id",verifyToken,verifyAdmin,async(req,res)=>{
      const id = req.params.id
      const updatedData = req.body
      const query ={
        _id : new ObjectId(id)
      }
      const result = await bookcollection.updateOne(query,{ $set : updatedData})
      res.send(result)
    })

    app.get("/api/allBooks",verifyToken,verifyAdmin,async(req,res)=>{
      const result = await bookcollection.find({}).sort({ createdAt: -1 }).toArray()
      res.send(result)
    })

    app.delete("/api/deleteBook/:id",verifyToken,verifyAdmin,async(req,res)=>{
      const id = req.params.id
      const query ={
        _id : new ObjectId(id)
      }
      const result = await bookcollection.deleteOne(query)
      res.send(result)
    })
    //----------------------------------------------------------

    //book delevary releted query
    app.get("/api/delevary/user", verifyToken, verifyUser,async (req, res) => {
      const userId = req.user._id.toString();
      const query = {
        userId,
        delevaryStatus: "delevared",
      };
      const result = await paymentCollection.find(query).toArray();
      res.send(result);
    });
    //book delevary releted query
    app.get("/api/notDelevary/user", verifyToken,verifyUser, async (req, res) => {
      const userId = req.user._id.toString();

      const result = await paymentCollection.find({ userId }).toArray();
      res.send(result || []);
    });

    //librarian delevary history
    app.get("/api/delivery/librarian", verifyToken,verifyLibrarian, async (req, res) => {
      try {
        const librarianId = req.user._id.toString();
        const result = await paymentCollection.find({ librarianId }).toArray();
        res.send(result);
      } catch (err) {
        res
          .status(500)
          .json({ message: "Failed to fetch librarian deliveries" });
      }
    });

    //delevary confrimetion
    app.patch("/api/confrim/delevary/:id",verifyToken,verifyLibrarian, async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await paymentCollection.updateOne(query, {
        $set: updatedData,
      });
      res.send(result);
    });

    //payment releted
    app.post("/api/payments",verifyToken, async (req, res) => {
      const history = req.body;
      const result = await paymentCollection.insertOne(history);
      res.send(result);
    });

    //Books releted
    app.post("/api/books",verifyToken,verifyLibrarian, async (req, res) => {
      const book = req.body;
      const newBook = {
        ...book,
        createdAt: new Date(),
      };
      const result = await bookcollection.insertOne(newBook);
      res.send(result);
    });

    app.get("/api/books",verifyToken,verifyLibrarian, async (req, res) => {
      const query = {};

      if (req.query.librarianId) {
        query.librarianId = req.query.librarianId;
      }

      const result = await bookcollection.find(query).toArray();
      res.send(result || []);
    });

    //detels page
    app.get("/api/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await bookcollection.findOne(query);
      res.send(result);
    });

    //book patch releted
    app.patch("/api/book/unpublish/:id",verifyToken, async (req, res) => {
      const id = req.params.id;
      const updated = req.body;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await bookcollection.updateOne(query, { $set: updated });
      res.send(result)
    });
    app.patch("/api/book/publish/:id",verifyToken, async (req, res) => {
      const id = req.params.id;
      const updated = req.body;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await bookcollection.updateOne(query, { $set: updated });
      res.send(result)
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
        const skipItems = (page - 1) * perPage;

        const total = await bookcollection.countDocuments(query);
        const cursor = bookcollection
          .find(query)
          .skip(skipItems)
          .limit(perPage);
        const books = await cursor.toArray();
        return res.send({ total, books });
      }

      const result = await bookcollection.find(query).toArray();
      res.send(result || []);
    });

    //review releted apis
    app.post("/api/reviews",verifyToken,verifyUser, async (req, res) => {
      const review = req.body;
      const newReview = {
        ...review,
        createdAt: new Date(),
      };
      const result = await reviewCollection.insertOne(newReview);
      res.send(result);
    });

    app.get("/api/all/reviews",verifyToken,verifyAdmin,async(req,res)=>{
      const result = await reviewCollection.find().sort({ createdAt: -1 }).toArray()
      res.send(result)
    })

    app.get("/api/reviews/:bookId", async (req, res) => {
      const bookId = req.params.bookId;
      const result = await reviewCollection.find({ bookId: bookId }).toArray();
      res.send(result);
    });

    app.get("/api/my/reviews/:userId", async (req, res) => {
      const userId = req.params.userId;
      const result = await reviewCollection.find({ userId: userId }).toArray();
      res.send(result);
    });

    app.patch("/reviews/:id",verifyToken,verifyUser, async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const quari = {
        _id: new ObjectId(id),
      };
      const result = await reviewCollection.updateOne(quari, {
        $set: updatedData,
      });
      res.send(result);
    });

    app.delete("/api/delete/review/:id",verifyToken,verifyUser, async (req, res) => {
      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
