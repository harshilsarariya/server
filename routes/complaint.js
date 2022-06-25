const express = require("express");
const router = express.Router();
const Complaint = require("../models/ComplaintSchema");
var fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const { isValidObjectId } = require("mongoose");

// ROUTE 1: Add a new Complaint using : POST "/api/complaint/addcomplaint" ,  login required

router.post(
  "/addcomplaint",
  [
    body("address", "Enter a valid Address ").isLength({
      min: 3,
    }),
    body("pincode", "Enter a valid Pincode").isLength({ min: 6 }),
    body("mobileNo", "Enter a valid Mobile Number").isLength({ min: 8 }),
    body("plumbingNo", "Enter a valid Plumbing Number").isLength({ min: 1 }),
    body("brandName", "Enter a valid Brand Name").isLength({ min: 2 }),
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
    body("syphoneColor", "Enter a valid Syphone Color").isLength({ min: 3 }),
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
      } = req.body;

      // const { complaintId } = req.params;

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

router.get("/fetchcomplaint/:id", fetchuser, async (req, res) => {
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
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 6: Search Complaints using : GET "api/complaint/search" ,  login required

router.get("/search", fetchuser, async (req, res) => {
  try {
    const { search } = req.query;
    if (!search.trim())
      return res.status(401).json({ error: "search query is missing!" });
    const complaints = await Complaint.find({
      $or: [
        { partyName: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { brandName: { $regex: search, $options: "i" } },
        { syphoneColor: { $regex: search, $options: "i" } },
      ],
    });
    res.json({
      complaints: complaints.map((complaint) => {
        return {
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
          syphoneColor: complaint.syphoneColor,
        };
      }),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error\n" + error.message);
  }
});

//  Search By id using : GET "api/complaint/searchByCompany" ,  login required
router.get("/searchByState", async (req, res) => {
  try {
    const { state } = req.query;

    // Find the complaint to be updated and update it
    let complaint = await Complaint.find({ state: state });

    if (!complaint) {
      return res.status(404).send("Complaint Not Found!");
    }

    res.json(complaint);
    console.log("complaint");
    console.log(complaint);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
router.get("/searchByCompany", async (req, res) => {
  try {
    const { compayName } = req.query;
    // if (!isValidObjectId(companyName))
    //   return res.status(401).json({ error: "Invalid Request" });
    // Find the complaint to be updated and update it
    let complaint = await Complaint.find({ brandName: compayName });
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
    const { mobileNo } = req.query;
    // Find the complaint to be updated and update it
    let complaint = await Complaint.find({ mobileNo: mobileNo });
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

// ROUTE 7: Search Complaint by status using : GET "api/complaint/searchByStatus" ,  login required

router.get("/searchByOpen", fetchuser, async (req, res) => {
  try {
    const { search } = req.query;
    console.log(search);
    if (!search.trim())
      return res.status(401).json({ error: "search query is missing!" });
    const complaints = await Complaint.find({
      $or: [
        { problemSolved: { $regex: search, $options: "i" } === "No" },
        {
          workDone: { $regex: search, $options: "i" } === "No",
        },
      ],
    });
    res.json({
      complaints: complaints.map((complaint) => {
        return {
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
          syphoneColor: complaint.syphoneColor,
        };
      }),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error\n" + error.message);
  }
});
router.get("/searchByClosed", fetchuser, async (req, res) => {
  try {
    const { workDone } = req.query;
    console.log(workDone);
    if (!workDone.trim())
      return res.status(401).json({ error: "workDone query is missing!" });
    const complaints = await Complaint.find({
      workDone: { $regex: workDone, $options: "i" },
    });
    res.json({
      complaints: complaints.map((complaint) => {
        return {
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
          syphoneColor: complaint.syphoneColor,
        };
      }),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error\n" + error.message);
  }
});
router.get("/searchByInProgress", fetchuser, async (req, res) => {
  try {
    const { problemSolved } = req.query;
    console.log(problemSolved);
    if (!problemSolved.trim())
      return res.status(401).json({ error: "problemSolved query is missing!" });
    const complaints = await Complaint.find({
      problemSolved: { $regex: problemSolved, $options: "i" },
    });
    res.json({
      complaints: complaints.map((complaint) => {
        return {
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
          syphoneColor: complaint.syphoneColor,
        };
      }),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error\n" + error.message);
  }
});

// Route 8: Fetch recent Complaint  using : GET "api/complaint/fetchComplaints" ,  login required

router.get("/fetchComplaints", async (req, res) => {
  try {
    const { pageNo = 0, limit = 5 } = req.query;

    const complaints = await Complaint.find({})
      .sort({ date: -1 })
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
