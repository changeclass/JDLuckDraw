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
};
