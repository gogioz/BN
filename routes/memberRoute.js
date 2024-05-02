import express from "express";
import { Member } from "../models/memberModel.js";
import multer from "multer";

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

const uploadImages = upload.array("images", 2);
// const uploadXsImages = upload.single("xsimage");

// post new Article
router.post("/team", uploadImages, async (req, res) => {
  try {
    const {
      title,
      titleTrans,
      about1,
      about1Trans,
      about2,
      about2Trans,
      name,
      nameTrans,
      link,
    } = req.body;
    const imageNames = req.files.map(
      (image) => `/src/assets/${image.filename}`
    );

    const newMember = {
      title: title,
      titleTrans: titleTrans,
      about1: about1,
      about1Trans: about1Trans,
      about2: about2,
      about2Trans: about2Trans,
      name: name,
      nameTrans: nameTrans,
      link: link,
      images: imageNames,
    };

    // create the new member
    const member = await Member.create(newMember);

    // if success send the member
    return res.status(201).send(member);
    // if not handle the error
  } catch (err) {
    console.log(err.message);
    console.log(req.body);
    res.status(500).send({ message: err.message });
  }
});

// get all articles in database
router.get("/team", async (req, res) => {
  try {
    const articles = await Member.find({});
    return res.status(200).json({
      count: articles.length,
      data: articles,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

// get one teamMember in database by id
router.get("/team/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);
    return res.status(200).json(member);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

// update an teamMember in the database
router.put("/team/:id", uploadImages, async (req, res) => {
  try {
    const {
      title,
      titleTrans,
      name,
      nameTrans,
      about1,
      about1Trans,
      about2,
      about2Trans,
      link,
    } = req.body;

    const imageNames = req.files.map(
      (image) => `/src/assets/${image.filename}`
    );

    const update = {
      title: title,
      titleTrans: titleTrans,
      about1: about1,
      about1Trans: about1Trans,
      about2: about2,
      about2Trans: about2Trans,
      name: name,
      link: link,
      nameTrans: nameTrans,
      images: imageNames,
    };

    const { id } = req.params;

    const result = await Member.findByIdAndUpdate(id, update);

    if (!result) {
      return res.status(404).send({ message: "Member not found" });
    }

    return res.status(200).send({ message: "Member updated successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

// delete Member from the database
router.delete("/team/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Member.findByIdAndDelete(id);
    if (result === false) {
      return res.status(404).send({ message: "Member not found" });
    }
    return res.status(200).send({ message: "Member deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: "Member not found" });
  }
});

export default router;
