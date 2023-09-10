const app = require('./app');
const connectDb = require('./config/dbConnect');
const { connectcloud } = require('./utils/cloudinary');

require('dotenv').config();
console.log(process.env.DB_URI);

const server = app.listen(process.env.PORT, () => {
  connectDb();
  connectcloud();
  console.log(`server listening throgh port ${process.env.PORT}`);
});
