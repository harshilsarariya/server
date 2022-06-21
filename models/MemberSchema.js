const mongoose = require("mongoose");
const { Schema } = mongoose;

const MemberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  isForwardingMember: {
    type: String,
    required: true,
  },
  states: {
    type: [String],
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Member = mongoose.model("member", MemberSchema);
module.exports = Member;
