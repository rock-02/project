const mongoose = require("mongoose");

const connectDb = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log(`Connected to Databse ${process.env.DB_URI}`))
    .catch("Error In connectiong databse");
};

module.exports = connectDb;
