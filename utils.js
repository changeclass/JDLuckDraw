/*
 * @Author: 小夜勃
 * @Date: 2020-09-13 09:48:02
 * @LastEditTime: 2020-09-14 16:44:02
 * @小夜勃博客:https://zxq.acs.pw/
 */
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
  // 返回年月日格式的日期
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

  // 抽奖概率
  randomDraw(goodsData) {
    let number = Math.floor(Math.random() * (130 + 1));
    if (number >= 0 && number <= 5) {
      return goodsData[0].prizeName;
    } else if (number >= 6 && number <= 15) {
      return goodsData[1].prizeName;
    } else if (number >= 16 && number <= 30) {
      return goodsData[2].prizeName;
    } else if (number >= 31 && number <= 50) {
      return goodsData[3].prizeName;
    } else if (number >= 51 && number <= 85) {
      return goodsData[4].prizeName;
    } else {
      return goodsData[5].prizeName;
    }
  },
};
