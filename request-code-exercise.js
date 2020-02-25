const fs = require("fs");
const fetch = require("node-fetch");
const assert = require("assert");

let jsonText = []; // <-- создаем пустой массив для будующих данных
/**
 * "открываем" файл, преобразуем его в массив
 * строк, разделив их по переносу строки "\n"
 */
let getTextByLine = fs
  .readFileSync("request-code.txt")
  .toString()
  .split("\n");

/**
 * каждую из строк этого списка разделяем на по зяпятой
 * для формерования объектов со значениями request и code
 * и добавляем их в заготовденый массив
 */
getTextByLine.forEach(line => {
  let lineObj = {};
  let lineItems = line.split(", ");
  lineObj.request = lineItems[0];
  lineObj.code = lineItems[1];
  jsonText.push(lineObj);
});
// console.log(`this jsonTextItem: ${JSON.stringify(jsonText)}`);

/**
 * проходимся по каздому объекту из списка и дергаем запрос
 * после чего проверяем актуальный status_code с ожидаемым
 */
jsonText.forEach(item => {
  async function checkRequestStatusCode(request, code) {
    const req = await fetch(request, {
      method: "GET",
      headers: { "Content-type": "application/json" }
    });
    console.log(req.status);
    assert.equal(
      req.status,
      code,
      `\nRequest failed, current status_code: ${req.status} \nexpected status_code: ${code}\n`
    );
  }
  checkRequestStatusCode(item.request, item.code);
});
