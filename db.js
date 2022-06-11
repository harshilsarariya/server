const mongoose = require("mongoose");

// url for connect database
const mongoURI =
  "mongodb+srv://harshil:harshilsarariya@cluster0.mrfwzl5.mongodb.net/ideal?retryWrites=true&w=majority";

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to Mongo Successfully");
  });
};

module.exports = connectToMongo;
