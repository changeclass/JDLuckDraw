/*
 * @Author: 小夜勃
 * @Date: 2020-09-20 11:22:47
 * @LastEditTime: 2020-09-20 14:43:27
 * @小夜勃博客:https://zxq.acs.pw/
 */
const express = require("express");

var bodyParser = require("body-parser");
var cookieSession = require("cookie-session");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: "JDCJ",
    keys: ["123", "456", "xiaokang"],
    maxAge: 24 * 69 * 60 * 1000, // 过期事件 24小时过期
  })
);

//设置跨域访问
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length,Authorization,Accept,X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next();
});

app.use(express.static(__dirname + "/public"));
let utils = require("./utils");
app.use(async function (req, res, next) {
  // 读取用户数据
  req.userData = await utils.readFile("user.json");
  // 测试
  // req.aaa = await utils.readFile("aaa.json");

  // 读取商品数据
  req.goodsData = await utils.readFile("goods.json");
  next();
});

app.use("/user", require("./user"));
app.use("/function", require("./function"));

app.listen(port, () =>
  console.log(`Example app listening on http://localhost:${port}`)
);
