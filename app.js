const express = require("express");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const jsw = require("jsonwebtoken");
const axios = require("axios");
const secretkey = "bokachoda";
const app = express();
app.use(cookieParser());
const datas = [
  {
    name: "user1",
    password: 1234,
  },
  {
    name: "user2",
    password: 12345,
  },
];

app.get("/login", (req, res) => {
  const { username, password } = req.query;
  if (username && password) {
    const user = datas.find((element) => element.name == username);
    if (user) {
      if (user.password == password) {
        const token = jsw.sign({ username }, secretkey);

        res.cookie("session", token);
        res.json({
          statsu: 200,
          data: user,
        });
      } else {
        res.json({
          statsu: 200,
          massage: "password mismatch",
        });
      }
    } else {
      res.json({
        statsu: 200,
        massage: "wrong username",
      });
    }
  } else {
    res.json({
      status: 404,
      masssage: "fields cant be empty",
    });
  }
});
app.get("/quote", async (req, res) => {
  const uu = req.cookies.session;
  if (!uu) return res.json({ status: 400, massage: "not veriffied" });
  try {
    const { data } = await axios.get("https://dummyjson.com/quotes/random");
    if (!data) return res.json({ status: 500, massage: "server error" });
    res.json({
      status: 200,
      data,
    });
  } catch (err) {
    res.json({ status: 500, massage: "server error" });
  }
});
app.listen(3000, () => {
  console.log("server listening at http://localhost:3000");
});
