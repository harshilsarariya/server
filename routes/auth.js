const express = require("express");
const router = express.Router();
const Member = require("../models/MemberSchema");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

// jwt secret key
const JWT_SECRET = "ideal@company%^&461)";

// ROUTE 1: Create a Member using : POST "api/auth/createmember" , No login required
router.post("/createmember", async (req, res) => {
  let success = false;

  // If there are error then return the bad request and error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {
    if (req.body.name.isLength <= 2) {
      return res.status(400).json({
        success,
        errors: "Name must be atleast 2 characters long",
      });
    }

    // check whether the user with same email exists already
    let member = await Member.findOne({ email: req.body.email });
    if (member) {
      return res.status(400).json({
        success,
        errors: "Member with this email already exsits",
      });
    }

    if (isNaN(req.body.phone)) {
      return res.status(400).json({
        success,
        errors: "Phone number must be a valid number",
      });
    }

    // hashing a password
    const salt = bcrypt.genSaltSync(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    member = await Member.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: secPass,
    });

    const data = {
      member: {
        id: member.id,
      },
    };

    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    console.log(success);
    res.json({ success, authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error\n" + error.message);
  }
});

//ROUTE 2  : login a Member using : POST "api/auth/signin" , No login required
router.post("/signin", async (req, res) => {
  let success = false;
  // If there are error then return the bad request and error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let member = await Member.findOne({ email });
    if (!member) {
      success = false;
      return res
        .status(400)
        .json({ errors: "Please try to login with correct credentials" });
    }
    if (req.body.password === "") {
      return res.status(400).json({
        success,
        errors: "Password can not be blank",
      });
    }

    const passwordCompare = await bcrypt.compare(password, member.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({
        success,
        errors: "Please try to login with correct credentials",
      });
    }
    const data = {
      member: {
        id: member.id,
      },
    };

    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 3 : Get loggedin Member Details using : POST "/api/auth/getmember" Login required
router.post("/getmembers", async (req, res) => {
  try {
    // let memberId = req.member.id;
    const member = await Member.find({});
    res.send(member);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
