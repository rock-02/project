const app = require("./app");
const connectDb = require("./config/dbConnect");

require("dotenv").config();
console.log(process.env.DB_URI);

const server = app.listen(process.env.PORT, () => {
  connectDb();
  console.log(`server listening throgh port ${process.env.PORT}`);
});


