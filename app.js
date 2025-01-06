const express = require("express");
const dbConnect = require("./config/dbConnect");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
dbConnect();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", require("./routes/userRoute"));

app.listen(5000, () => {
  console.log("5000 포트에서 서버 실행 중");
});
