const express = require("express");
const router = express.Router();
const Complaint = require("../models/ComplaintSchema");
var fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const moment = require("moment");
// ROUTE 1: Add a new Complaint using : POST "/api/complaint/addcomplaint" ,  login required

router.post(
  "/addcomplaint",
  [
    body("address", "Enter a valid Address ").isLength({
      min: 3,
    }),
    body("pincode", "Enter a valid Pincode").isLength({ min: 6 }),
    body("mobileNo", "Enter a valid Mobile Number").isLength({ min: 8 }),
    body("plumbingNo", "Enter a valid Office Number").isLength({ min: 1 }),
    body("brandName", "Enter a valid Brand Name").isLength({ min: 2 }),
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
        repeat,
        syphoneColor,
        entryUserEmail,
        code,
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
        repeat,
        syphoneColor,
        entryUserEmail,
        code,
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

// ROUTE 2: Update an existing Complaint using : PUT "api/complaint/updatecomplaint" ,  login required

router.put(
  "/updatecomplaint/:id",
  [
    body("address", "Enter a valid Address ").isLength({
      min: 3,
    }),
    body("pincode", "Enter a valid Pincode").isLength({ min: 6 }),
    body("mobileNo", "Enter a valid Mobile Number").isLength({ min: 8 }),
    body("plumbingNo", "Enter a valid Plumbing Number").isLength({ min: 1 }),
    body("brandName", "Enter a valid Brand Name").isLength({ min: 2 }),
    body("remark", "Enter a valid Remark").isLength({ min: 2 }),
    body("problem", "Enter a valid Problem").isLength({ min: 2 }),
    body("solution", "Enter a valid Solution").isLength({ min: 2 }),
    body("plumberName", "Enter a valid Plumber Name").isLength({ min: 2 }),
  ],
  async (req, res) => {
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
        remark,
        problem,
        solution,
        plumberName,
        closingDate,
        code,
      } = req.body;

      if (!isValidObjectId(req.params.id)) {
        return res.status(401).json({ error: "Invalid Request" });
      }
      // Find the note to be updated and update it
      let complaint = await Complaint.findById(req.params.id);
      if (!complaint) {
        return res.status(404).send("Complaint Not Found");
      }

      complaint.partyName = partyName;
      complaint.address = address;
      complaint.pincode = pincode;
      complaint.state = state;
      complaint.city = city;
      complaint.mobileNo = mobileNo;
      complaint.plumbingNo = plumbingNo;
      complaint.brandName = brandName;
      complaint.workDone = workDone;
      complaint.problemSolved = problemSolved;
      complaint.repeat = repeat;
      complaint.syphoneColor = syphoneColor;
      complaint.remark = remark;
      complaint.problem = problem;
      complaint.solution = solution;
      complaint.plumberName = plumberName;
      complaint.closingDate = closingDate;
      complaint.code = code;

      await complaint.save();
      res.json({
        complaint: {
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
          remark,
          problem,
          solution,
          plumberName,
          closingDate,
          code,
        },
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error\n" + error.message);
    }
  }
);

// ROUTE 3: Get all Complaints using : GET "api/complaint/fetchallcomplaints" ,  login required

router.get("/fetchallcomplaints", async (req, res) => {
  try {
    const complaints = await Complaint.find({});
    res.json(complaints);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 4: Delete an existing Complaint using : DELETE "api/complaint/deletecomplaint" ,  login required

router.delete("/deletecomplaint/:id", async (req, res) => {
  try {
    const prmId = req.params.id;
    if (!isValidObjectId(prmId))
      return res.status(401).json({ error: "Invalid Request" });
    // Find the note to be updated and update it
    let complaint = await Complaint.findById(prmId);

    if (!complaint) {
      return res.status(404).send("Complaint Not Found!");
    }

    complaint = await Complaint.findByIdAndDelete(prmId);
    res.json({ Success: "Note has been deleted", complaint: complaint });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 5: Get a single Note using : GET "api/complaint/fetchcomplaint/:id" ,  login required

router.get("/fetchcomplaint/:id", async (req, res) => {
  try {
    const prmId = req.params.id;
    if (!isValidObjectId(prmId))
      return res.status(401).json({ error: "Invalid Request" });

    // Find the note to be updated and update it
    let complaint = await Complaint.findById(prmId);
    if (!complaint) {
      return res.status(404).send("Complaint Not Found!");
    }
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
      date,
      code,
    } = complaint;

    res.json({
      complaint: {
        id: complaint._id,
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
        date,
        code,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 6: Search Complaints using : GET "api/complaint/search" ,  login required

router.get("/search", async (req, res) => {
  try {
    const { query, month } = req.query;
    let currDate = moment().year() + "-" + Number(month) + "-" + "1";
    currDate = new Date(currDate);
    let lastDate = moment().year() + "-" + (Number(month) + 1) + "-" + "1";
    lastDate = new Date(lastDate);
    const complaints = await Complaint.find({
      $and: [
        {
          $and: [
            { createdAt: { $gt: currDate } },
            { createdAt: { $lte: lastDate } },
          ],
        },
        {
          $or: [
            { brandName: { $regex: `${query}` } },
            { state: { $regex: `${query}` } },
          ],
        },
      ],
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error\n" + error.message);
  }
});

//  Search By id using : GET "api/complaint/searchByCompany" ,  login required
router.get("/searchByState", async (req, res) => {
  try {
    const { query, month } = req.query;
    let currDate = moment().year() + "-" + Number(month) + "-" + "1";
    currDate = new Date(currDate);
    let lastDate = moment().year() + "-" + (Number(month) + 1) + "-" + "1";
    lastDate = new Date(lastDate);

    // Find the complaint to be updated and update it
    let complaint = await Complaint.find({
      $and: [
        {
          $and: [
            { createdAt: { $gt: currDate } },
            { createdAt: { $lte: lastDate } },
          ],
        },
        { state: { $regex: `${query}` } },
      ],
    });

    if (!complaint) {
      return res.status(404).send("Complaint Not Found!");
    }

    res.json(complaint);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
router.get("/searchByCompany", async (req, res) => {
  try {
    const { brandName } = req.query;
    let complaint = await Complaint.find({
      brandName: { $regex: brandName },
    });
    if (!complaint) {
      return res.status(404).send("Complaint Not Found!");
    }

    res.json(complaint);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
router.get("/searchByPhoneNo", async (req, res) => {
  try {
    const { mobileNo, month } = req.query;
    // Find the complaint to be updated and update it
    let currDate = moment().year() + "-" + Number(month) + "-" + "1";
    currDate = new Date(currDate);
    let lastDate = moment().year() + "-" + (Number(month) + 1) + "-" + "1";
    lastDate = new Date(lastDate);
    let complaint = await Complaint.find({
      $and: [
        { createdAt: { $gt: currDate } },
        { createdAt: { $lte: lastDate } },
        { mobileNo: mobileNo },
      ],
    }).sort({
      createdAt: -1,
    });
    if (!complaint) {
      return res.status(404).send("Complaint Not Found!");
    }
    res.json(complaint);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
router.get("/searchById/:id", async (req, res) => {
  try {
    const prmId = req.params.id;
    if (!isValidObjectId(prmId))
      return res.status(401).json({ error: "Invalid Request" });
    // Find the complaint to be updated and update it
    let complaint = await Complaint.findById(prmId);
    if (!complaint) {
      return res.status(404).send("Complaint Not Found!");
    }
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
      code,
      remark,
      problem,
      solution,
      plumberName,
      closingDate,
    } = complaint;

    res.json({
      complaint: {
        id: complaint._id,
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
        code,
        remark,
        problem,
        solution,
        plumberName,
        closingDate,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
router.get("/fetchTodaysComplaintsCount", async (req, res) => {
  const { email } = req.query;
  try {
    let n = moment().month() + 1;
    if (n <= 9) {
      n = "0" + n;
    }
    let xdate = moment().date();
    if (xdate <= 9) {
      xdate = "0" + xdate;
    }
    let currDate = xdate + "-" + n + "-" + moment().year();
    let complaint = await Complaint.find({
      $and: [{ date: { $eq: currDate } }, { entryUserEmail: email }],
    });
    if (!complaint) {
      return res.status(404).send("Complaint Not Found!");
    }
    let lenTotal = complaint.length;
    res.json({ complaint, lenTotal });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
router.get("/fetchComplaintsCount", async (req, res) => {
  const { email, month } = req.query;
  try {
    let currDate = moment().year() + "-" + Number(month) + "-" + "1";
    let lastDate = moment().year() + "-" + (Number(month) + 1) + "-" + "1";
    let complaint = await Complaint.find({
      $and: [
        { createdAt: { $gt: currDate } },
        { createdAt: { $lte: lastDate } },
        { entryUserEmail: email },
      ],
    });
    if (!complaint) {
      return res.status(404).send("Complaint Not Found!");
    }
    let lenTotal = complaint.length;
    res.json({ complaint, lenTotal });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Route 8: Fetch recent Complaint  using : GET "api/complaint/fetchComplaints" ,  login required

router.get("/fetchComplaints", async (req, res) => {
  try {
    const { pageNo = 0, limit = 5 } = req.query;

    const complaints = await Complaint.find({})
      .sort({ createdAt: -1 })
      .skip(parseInt(pageNo) * parseInt(limit))
      .limit(parseInt(limit));

    const complaintCount = await Complaint.countDocuments();

    res.json({
      complaints: complaints.map((complaint) => ({
        id: complaint._id,
        partyName: complaint.partyName,
        address: complaint.address,
        pincode: complaint.pincode,
        state: complaint.state,
        city: complaint.city,
        mobileNo: complaint.mobileNo,
        plumbingNo: complaint.plumbingNo,
        brandName: complaint.brandName,
        workDone: complaint.workDone,
        problemSolved: complaint.problemSolved,
        repeat: complaint.repeat,
        code: complaint.code,
        syphoneColor: complaint.syphoneColor,
        date: complaint.date,
      })),
      complaintCount,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error\n" + error.message);
  }
});

module.exports = router;
