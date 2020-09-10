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
let utils = require("./utils");
app.use(async function (req, res, next) {
  // 读取用户数据
  req.userData = await utils.readFile("user.json");
  // 读取商品数据
  req.goodsData = await utils.readFile("goods.json");
  next();
});
app.use("/user", require("./user"));
app.use("/function", require("./function"));

app.listen(port, () =>
  console.log(`Example app listening on http://localhost:${port}`)
);
