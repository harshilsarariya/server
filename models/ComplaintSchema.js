const mongoose = require("mongoose");
const { Schema } = mongoose;

const ComplaintSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  partyName: {
    type: String,
    default: " ",
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
    required: true,
  },
  problemSolved: {
    type: String,
    required: true,
  },
  repeat: {
    type: String,
    required: true,
  },
  syphoneColor: {
    type: String,
    required: true,
  },
  remark: {
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
});
const Complaint = mongoose.model("complaint", ComplaintSchema);
module.exports = Complaint;
