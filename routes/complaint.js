const express = require("express");
const router = express.Router();
const Complaint = require("../models/ComplaintSchema");
const { body, validationResult } = require("express-validator");

// ROUTE 1: Add a new Complaint using : POST "/api/complaint" ,  login required

router.post(
  "/addcomplaint",
  [
    body("partyName", "Enter a valid Party name").isLength({
      min: 3,
    }),
    body("address", "Enter a valid Address ").isLength({
      min: 3,
    }),
    body("pincode", "Enter a valid Pincode").isLength({ min: 6 }),
    body("mobileNo", "Enter a valid Mobile Number").isLength({ min: 8 }),
    body("plumbingNo", "Enter a valid Plumbing Number").isLength({ min: 1 }),
    body("brandName", "Enter a valid Brand Name").isLength({ min: 3 }),
    body("syphoneColor", "Enter a valid Syphone Color").isLength({ min: 3 }),
  ],
  async (req, res) => {
    let success = false;
    try {
      const {
        partyName,
        address,
        pincode,
        state,
        city,
        mobileNo,
        plumbingNo,
        brandName,
        workDone,
        problemSolved,
        repeat,
        syphoneColor,
      } = req.body;

      // If there are error then return the bad request and error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const complaint = new Complaint({
        partyName,
        address,
        pincode,
        state,
        city,
        mobileNo,
        plumbingNo,
        brandName,
        workDone,
        problemSolved,
        repeat,
        syphoneColor,
      });

      const savecomplaint = await complaint.save();
      success = true;
      res.json({ success, savecomplaint });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }
);

module.exports = router;
