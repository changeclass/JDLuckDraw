/*
 * @Author: 小夜勃
 * @Date: 2020-09-13 09:48:02
 * @LastEditTime: 2020-09-14 16:48:33
 * @小夜勃博客:https://zxq.acs.pw/
 */
var express = require("express");

const axios = require("axios");

const utils = require("./utils");

const router = express.Router();
const fs = require("fs");
/**
 * 通过 req.userData 可以获取data.json文件夹的数据（已转成对象）
 * 通过对returnData传参可返回向客户端返回的数据
 *   * code：状态码0为正常，其他非正常
 *   * message：返回的描述
 *   * data：返回的数据，默认为空对象
 */

// 规定返回格式
function returnData(code, message, data = {}) {
  return {
    // 返回的状态码
    code: code,
    // 状态码描述
    meaage: message,
    // 返回数据,默认空字符串
    data: data,
  };
}
// let numberOfDraws = 3;
let nowadays = utils.nowDay();
router.get("/", (req, res) => {
  let numberOfDraws = 0;
  let phone = req.session.phone;
  if (req.userData[phone][nowadays] === undefined) {
    req.userData[phone][nowadays] = [];
    utils.writeFile("user.json", req.userData);
    numberOfDraws = 3 - req.userData[phone][nowadays].length;
  } else {
    numberOfDraws = 3 - req.userData[phone][nowadays].length;
  }
  res.send(
    returnData(0, "抽奖信息", {
      commodity: req.goodsData,
      frequency: numberOfDraws,
    })
  );
});

// 点击抽奖
router.get("/lottery", (req, res) => {
  // let phone = "18830705516";
  let phone = req.session.phone;
  let numberOfDraws = 3 - req.userData[phone][nowadays].length;
  console.log(numberOfDraws);
  if (numberOfDraws <= 0) {
    res.send(returnData(0, "抽奖次数已用完"));
  } else {
    let prizeName = utils.randomDraw(req.goodsData);
    req.userData[phone][nowadays].push(prizeName);
    utils.writeFile("user.json", req.userData);
    --numberOfDraws;
    res.send(returnData(0, "抽奖成功", { prizeName }));
  }
});

// 返回所有的抽奖结果
router.get("/checkLotteryResults", (req, res) => {
  // let phone = "18830705516";
  let phone = req.session.phone;

  if (req.userData[phone]) {
    let lotteryData = req.userData[phone];
    res.send(returnData(0, "历史抽奖结果", lotteryData));
  }
});

module.exports = router;
