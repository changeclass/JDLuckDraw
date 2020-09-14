const express = require("express");

const axios = require("axios");
const fs = require("fs");
const router = express.Router();

const utils = require("./utils");
/**
 * 通过 req.userData 可以获取data.json文件夹的数据（已转成对象）
 * 通过对returnData传参可返回向客户端返回的数据
 *   * code：状态码0为正常，其他非正常
 *   * message：返回的描述
 *   * data：返回的数据，默认为空对象
 */
// 尝试读取文件内容
router.get("/test", (req, res) => {
  // req.userData 为data文件的数据（已转成对象）
  res.send(returnData(0, `test`, req.userData["186301111111"]));
});
router.post("/login", (req, res) => {
  var phone = req.session.phone;
  if (phone) {
    console.log("已经存在！", phone);
  } else {
    req.session.phone = req.body.id;
    console.log("已经设置：", phone);
  }
  res.send(req.body.phone);
});
router.get("/login", (req, res) => {
  res.render("index");
});
// 尝试写入文件内容
router.get("/test1", (req, res) => {
  let data = req.userData;

  let time = utils.nowDay();
  if (data["186"] === undefined) {
    console.log(data["186"]);
    data["186"] = {};
    data["186"][time] = [];
    utils.writeFile("user.json", data).then((result) => {
      res.send(result);
    });
  } else {
    res.send("已存在");
  }
});

// 规定返回格式
function returnData(code, message, data = {}) {
  return {
    // 返回的状态码
    code: code,
    // 状态码描述
    message: message,
    // 返回数据,默认空字符串
    data: data,
  };
}
// 判断是否登陆
router.get("/checkLogin", (req, res) => {
  var phone = req.session.phone;
  if (phone) {
    // 已经登陆
    res.send(returnData(0, "已登陆用户", { phone: phone }));
  } else {
    // 未登录
    res.send(returnData(1, "未登陆用户"));
  }
});
//接收手机验证码等信息 并注册 或者返回验证码错误
router.post("/addUser", function (req, res) {
  // 获取手机短信验证码的ID
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
        "Basic N2RmNTM5NmY4ZjY4NDU0MDZmYjhkNTdlOmI4OWUxZDUzNDEyY2E2ZWQ4ZGFjMjgyMw==",
    },
  })
    .then(function (data) {
      console.log(data);
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
          });
        } else {
          // 用户存在执行的逻辑
          if (!data[phone][time]) {
            data[phone][time] = [];
            utils.writeFile("user.json", data);
          }
          res.send(returnData(1, "已经存在的用户"));
        }
        // 无论是否新用户，都建立Cookie
        req.session.phone = phone;
      } else {
        // 验证码不正确
        res.send(returnData(1, "验证码错误！", data.data));
      }
    })
    .catch((err) => {
      res.send(returnData(1, "暂时出现了一点小问题，请稍后在尝试。"));
    });
});
// 接收手机号并发送短信
router.post("/SendSms", function (req, res) {
  var mobile = req.body.phone;
  axios({
    method: "post",
    url: "https://api.sms.jpush.cn/v1/codes",
    data: {
      mobile: mobile,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic N2RmNTM5NmY4ZjY4NDU0MDZmYjhkNTdlOmI4OWUxZDUzNDEyY2E2ZWQ4ZGFjMjgyMw==",
    },
  }).then(function (data) {
    res.send(returnData(0, `已向${mobile}发送验证码`, data.data));
  });
});

module.exports = router;
