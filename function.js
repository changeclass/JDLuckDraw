var express = require("express");

const axios = require("axios");

const router = express.Router();
/**
 * 通过 req.Date 可以获取data.json文件夹的数据（已转成对象）
 * 通过对returnData传参可返回向客户端返回的数据
 *   * code：状态码0为正常，其他非正常
 *   * message：返回的描述
 *   * data：返回的数据，默认为空对象
 */

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
