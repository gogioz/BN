import express from "express";
import { Article } from "../models/articleModel.js";
import multer from "multer";
import { MongoClient, ObjectId } from "mongodb";
import { mongoDBURL } from "../config.js";
const client = new MongoClient(mongoDBURL);

const router = express.Router();

// Set up Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../Front-End/src/assets/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadImages = upload.single("image");

// post new Article
router.post("/articles", uploadImages, async (req, res) => {
  try {
    const {
      title,
      titleTrans,
      subTitle,
      subTitleTrans,
      description,
      descriptionTrans,
    } = req.body;
    const imageName = `/src/assets/${req.file.filename}`;
    const newArticle = {
      title: title,
      titleTrans: titleTrans,
      subTitle: subTitle,
      subTitleTrans: subTitleTrans,
      description: description,
      descriptionTrans: descriptionTrans,
      image: imageName,
    };

    const db = client.db("your_database");
    const collection = db.collection("your_collection");

    // Insert the new object
    collection.insertOne(newArticle, (err, res) => {
      if (err) {
        console.error("Error creating new object:", err);
        return res.status(500).send("Error creating new object");
      }
      res.send("New object created successfully");
    });
  } catch (err) {
    console.log(err.message);
    console.log(req.body);
    res.status(500).send({ message: err.message });
  }
});

// get all articles in databasee
router.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find({});
    return res.status(200).json({
      count: articles.length,
      data: articles,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

// get one article in database by id
router.get("/articles/:id", async (req, res) => {
  try {
    // Get the database and collection on which to run the operation
    const database = client.db("test");
    const articles = database.collection("articles");
    // Query for a movie that has the title 'The Room'

    const { id } = req.params;
    // Execute query
    const article = await articles.findOne({ _id: new ObjectId(id) });
    // Print the document returned by findOne()
    return res.status(200).json(article);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

// update an article in the database
router.put("/articles/:id", uploadImages, async (req, res) => {
  try {
    const {
      title,
      titleTrans,
      subTitle,
      subTitleTrans,
      description,
      descriptionTrans,
    } = req.body;
    const imageName = `/src/assets/${req.file.filename}`;
    const update = {
      title: title,
      titleTrans: titleTrans,
      subTitle: subTitle,
      subTitleTrans: subTitleTrans,
      description: description,
      descriptionTrans: descriptionTrans,
      image: imageName,
    };
    const db = client.db("test");
    const collection = db.collection("articles");

    const { id } = req.params;
    // Update the document
    const query = { _id: new ObjectId(id) };

    collection.updateOne(query, update, (err, res) => {
      if (err) {
        console.error("Error updating Article:", err);

        return res.status(404).send({ message: "Article not found" });
      }
      return res.status(200).send({ message: "Article updated successfully" });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

// delete article from the database
router.delete("/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Article.findByIdAndDelete(id);
    if (result === false) {
      return res.status(404).send({ message: "Article not found" });
    }
    return res.status(200).send({ message: "Article deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: "Article not found" });
  }
});

export default router;
