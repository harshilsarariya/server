const mongoose = require("mongoose");
const { Schema } = mongoose;
const moment = require("moment");
const dateNow = moment(Date.now()).format("DD-MM-YYYY");
const ComplaintSchema = new Schema({
  date: {
    type: String,
    default: dateNow,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  partyName: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: Number,
    required: true,
  },
  plumbingNo: {
    type: Number,
    required: true,
  },
  brandName: {
    type: String,
    required: true,
  },
  workDone: {
    type: String,
    default: "No",
  },
  problemSolved: {
    type: String,
    default: "No",
  },
  repeat: {
    type: String,
    required: true,
  },
  syphoneColor: {
    type: String,
    default: "",
  },
  code: {
    type: String,
  },
  remark: {
    type: String,
  },
  entryRemark: {
    type: String,
  },
  problem: {
    type: String,
  },
  solution: {
    type: String,
  },
  plumberName: {
    type: String,
  },
  closingDate: {
    type: String,
  },
  entryUserEmail: {
    type: String,
  },
});
const Complaint = mongoose.model("complaint", ComplaintSchema);
module.exports = Complaint;
