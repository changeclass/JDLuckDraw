var express = require("express");

// const axios = require("axios");

const utils = require("./utils");
const bodyParser = require("body-parser");
const router = express.Router();
// const fs = require("fs");
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
router.get("/prizeInformation", (req, res) => {
  res.send(
    returnData(0, "抽奖信息", {
      commodity: req.goodsData,
    })
  );
});

// 点击抽奖
router.post("/lottery", (req, res) => {
  let prize = JSON.parse(req.body.prize);
  let phone = req.body.phone;
  let numberOfDraws = 2 - req.userData[phone][nowadays].length;
  if (numberOfDraws <= 0) {
    res.send(returnData(1, "抽奖次数已用完"));
  } else {
    req.userData[phone][nowadays].push(prize.prizeName);
    utils.writeFile("user.json", req.userData);
    --numberOfDraws;
    res.send(returnData(0, "抽奖成功", {}));
  }
});

// 返回所有的抽奖结果
router.get("/checkLotteryResults", (req, res) => {
  let phone = req.session.phone;
  console.log("1");
  if (req.userData[phone]) {
    let lotteryData = req.userData[phone];
    res.send(returnData(0, "历史抽奖结果", lotteryData));
  }
});

module.exports = router;
