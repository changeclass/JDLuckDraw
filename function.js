/*
 * @Author: 小夜勃
 * @Date: 2020-09-13 09:48:02
 * @LastEditTime: 2020-09-13 16:39:58
 * @小夜勃博客:https://zxq.acs.pw/
 */
var express = require("express");

const axios = require("axios");

const utils = require("./utils");

const router = express.Router();
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

router.get("/", (req, res) => {
  res.send(returnData(0, "商品信息", { commodity: req.goodsData }));
});

// 抽奖次数 & 商品信息  & 抽取奖品结果
router.get("/clickToDraw", (req, res) => {
  // let phone = req.session.phone;
  let phone = "15677700703";
  // let phone = "";
  if (req.userData[phone]) {
    let nowadays = utils.nowDay();
    if (req.userData[phone][nowadays]) {
      let numberOfDraws = 3 - req.userData[phone][nowadays].length;

      res.send(returnData(0, "抽奖次数", { number: numberOfDraws }));
    }
  }
});

// 返回所有的抽奖结果
router.get("/checkLotteryResults", (req, res) => {
  // var phone = req.session.phone;
  let phone = "15677700703";
  if (req.userData[phone]) {
    let lotteryData = req.userData[phone];
    res.send(returnData(0, "历史抽奖结果", lotteryData));
  }
});

module.exports = router;
