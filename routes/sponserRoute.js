import express from "express";
import { Sponser } from "../models/sponserModel.js";
import multer from "multer";

const router = express.Router();

// Set up Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../Front-End/src/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadLogo = upload.single("logo");

// post new sponser
router.post("/sponsers", uploadLogo, async (req, res) => {
  try {
    const imageName = `/src/assets/${req.file.filename}`;
    const newSponser = {
      logo: imageName,
    };

    // create the new sponser
    const sponser = await Sponser.create(newSponser);

    // if success send the sponser
    return res.status(201).send(sponser);
    // if not handle the error
  } catch (err) {
    console.log(err.message);
    console.log(req.body);
    res.status(500).send({ message: err.message });
  }
});

// get all articles in database
router.get("/sponsers", async (req, res) => {
  try {
    const sponsers = await Sponser.find({});
    return res.status(200).json({
      count: sponsers.length,
      data: sponsers,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

// get one article in database by id
router.get("/sponsers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sponser = await Sponser.findById(id);
    return res.status(200).json(sponser);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

export default router;
