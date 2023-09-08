const app = require("./app");

require("dotenv").config();
console.log(process.env.DB_URI);

const server = app.listen(process.env.PORT, () =>
  console.log(`server listening throgh port ${process.env.PORT} `)
);
