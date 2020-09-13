## 项目说明

此项目为田子康、乔越、周新桥三人组的京东抽奖项目。

|  姓名  |   项目分工   |
| :----: | :----------: |
|  乔越  |   前端实现   |
| 田子康 | 后端接口开发 |
| 周新桥 | 后端接口开发 |

项目地址：https://github.com/changeclass/JDLuckDraw

## 项目功能说明

1. 登录与注册采用统一实现（短信验证码）

   - 已注册直接登陆
   - 未注册创建用户并登陆

2. 抽奖

   用户**每天**只能抽奖三次，可以展示数日的抽奖记录。

3. 抽奖概率

   抽奖概率的可控性

4. 其他

   待补充

## 项目数据存储问题

因项目较小，因此不考虑使用数据库进行数据的存储。而是采用JSON文件进行数据的存储。

```json
{
    "186777777777": {
        "20200910": [],
        "20200909": [],
        "20200908": []
    }
}
```

采用如上结构进行数据存储，其好处有两点：

- 通过判断键是否为`undefined`即可判断用户是否存在

- 如果键存在，那么其对应的值为一个对象。

  这个对象键为日期（20200910），其值为列表。通过判断列表的`length`即可判断今日用户是否进行了抽奖。列表内元素即为中奖物品。

## 2020-09-10

### 基本架构搭建

![image-20200910215813487](https://files.alexhchu.com/2020/09/10/adb26360a697e.png)

商品数据暂定使用列表进行存储。

```json
[]
```

服务器入口文件

```javascript
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

```

其他功能模块(部分)

```javascript
var express = require("express");

const axios = require("axios");

const router = express.Router();

// 规定返回格式
function returnData(code, message, data = "") {
  return {
    // 返回的状态码
    code: code,
    // 状态码描述
    meaage: message,
    // 返回数据,默认空字符串
    data: data,
  };
}

router.get("/test", (req, res) => {
  res.send(returnData(0, `测试成功`));
});

module.exports = router;

```



### 文件的读取与写入

由于JS异步的天性，读取文件不能通过"直线性"思维，而是通过异步获取，通过ES6的`async`与`await`实现。

为了方便在其他地方使用此方法，将读文件，写文件获取当前日期（ 年月日）写成模块，方便在其他文件引入并调用。

```javascript
let fs = require("fs"),
    path = require("path");

module.exports = {
    // 读文件
    // 传入data文件夹下的完整文件名
    readFile(fileName) {
        return new Promise((resolve, reject) => {
            fs.readFile(__dirname + `/data/${fileName}`, "utf-8", (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                data = JSON.parse(data);
                resolve(data);
            });
        });
    },
    // 写文件
    // 传入 须写入文件的文件名称与写入内容(完整)
    writeFile(fileName, content) {
        content = typeof content !== "string" ? JSON.stringify(content) : content;
        return new Promise((resolve, reject) => {
            fs.writeFile(__dirname + `/data/${fileName}`, content, "utf-8", (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve("写入成功！");
            });
        });
    },
    // 获取当前日期
    nowDay() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        return `${year}${month}${day}`;
    },
};
```

### 登陆与注册

登陆与注册采用一体结构，判断规则就是判断用户数据文件是否存在用户手机号的键值。

```javascript
//接收手机验证码等信息 并注册 或者返回验证码错误
router.post("/addUser", function (req, res) {
    // 获取订单ID
    var vcodeID = req.body.vcodeID;
    // 获取手机号码
    var phone = req.body.mobile;
    // 获取用户验证码
    var code = req.body.vcode;
    // 拼接请求地址
    var url = `https://api.sms.jpush.cn/v1/codes/${vcodeID}/valid`;
    axios({
        method: "post",
        url: url,
        data: {
            code: code,
        },
        headers: {
            "Content-Type": "application/json",
            Authorization:
            "用户密钥！！！",
        },
    })
        .then(function (data) {
        if (data.data.is_valid) {
            // 验证码正确执行的逻辑
            // 用户数据
            let data = req.userData;
            // 今天时间 年月日
            let time = utils.nowDay();
            // 判断手机号是否存在
            if (data[phone] === undefined) {
                // 如果没有此用户执行的逻辑
                data[phone] = {};
                data[phone][time] = [];
                utils.writeFile("user.json", data).then((result) => {
                    // 成功写入文件
                    res.send(returnData(0, result));
                    // TODO 记录登陆状态
                });
            } else {
                // 用户存在执行的逻辑
                // TODO 记录登陆状态
                res.send(returnData(1, "已经存在的用户"));
            }
        } else {
            // 验证码不正确
            res.send(returnData(1, "验证码错误！", data.data));
        }
    })
        .catch((err) => {
        res.send(returnData(1, "暂时出现了一点小问题，请稍后在尝试。"));
    });
});
```



