const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Murph = require("../../models/Murph");
const User = require("../../models/User");

// @route		POST api/murphs
// @desc		Save new murph
// @access	Private
router.post(
  "/",
  [
    auth,
    [
      check("mileOneTime", "Time is required").not().isEmpty(),
      check("calisthenicsTime", "Time is required").not().isEmpty(),
      check("mileTwoTime", "Time is required").not().isEmpty(),
      check("totalTime", "Time is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newMurph = new Murph({
        user: req.user.id,
        mileOneTime: req.body.mileOneTime,
        calisthenicsTime: req.body.calisthenicsTime,
        mileTwoTime: req.body.mileTwoTime,
        totalTime: req.body.totalTime,
      });

      const murph = await newMurph.save();

      // Add Id of new murph to user murphs array
      const user = await User.findById(req.user.id);
      user.murphs.push(murph._id);
      await user.save();

      res.json(murph);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route		GET api/murphs
// @desc		Get all murphs
// @access	Public
router.get("/", async (req, res) => {
  try {
    const murphs = await Murph.find()
      .sort({ totalTime: 1 })
      .populate("user", "fname lname");
    res.json(murphs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route		GET api/murphs/id
// @desc		Get single murph
// @access	Public
router.get("/:id", async (req, res) => {
  try {
    const murph = await Murph.findById(req.params.id).populate(
      "user",
      "_id fname lname"
    );

    res.json(murph);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
