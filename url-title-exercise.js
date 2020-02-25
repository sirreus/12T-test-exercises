const fs = require("fs");
const puppeteer = require("puppeteer");
const assert = require("assert");

let jsonText = []; // <-- создаем пустой массив для будующих данных
/**
 * "открываем" файл, преобразуем его в массив
 * строк, разделив их по переносу строки "\n"
 */
let getTextByLine = fs
  .readFileSync("urls-list.txt")
  .toString()
  .split("\n");

/**
 * каждую из строк этого списка разделяем на по зяпятой
 * для формерования объектов со значениями url и title
 * и добавляем их в заготовденый массив
 */
getTextByLine.forEach(line => {
  let lineObj = {};
  let lineItems = line.split(", ");
  lineObj.url = lineItems[0];
  lineObj.title = lineItems[1];
  jsonText.push(lineObj);
});
// console.log(`this jsonTextItem: ${JSON.stringify(jsonText)}`);

/**
 * получив массив из объектов с url и title значениями
 * проходимся по каждому url и сверяем соответствующий title
 * с тем что мы фофакту получили при открытии страницы
 */
jsonText.forEach(item => {
  async function checkUrlTitle(item) {
    const browser = await puppeteer.launch(); // <-- запускаем браузер
    const page = await browser.newPage(); // <-- открываем вкладку
    await page.goto(item.url); // <-- проходим по урлу
    await page.on("pageerror", function(err) {
      theTempValue = err.toString();
      console.log("Page error: " + theTempValue);
    });
    const currentPageTitle = await page.title(); // <-- получаем текущий заголовок страницы

    /**
     * тут так же представлен способ сравнения с помощью
     * метода .localeCompare , но он мне не особо нравится
     * т.к. он не "фэйлит" работу скрипта в отличии от assert.
     */
    // let ans = item.title.localeCompare(currentPageTitle);
    // if (ans !== 0) {
    //   console.log(
    //     '"' + item.title + '" is NOT equal "' + currentPageTitle + '"'
    //   );
    // } else {
    //   console.log("Title is correct");
    // }

    /**
     * если заголовок у страници есть, то берем и сравниваем его с ожидаемым,
     * тем который у нас прописан в файле, если они не совпадают получаем ошибку,
     * если актуального заголовка нет, то получаем вывод сообщения в консоль
     */
    if (currentPageTitle) {
      assert.strictEqual(
        item.title,
        currentPageTitle,
        `\nCurrent page title: ${currentPageTitle} is NOT equal to\nexpected page title: ${item.title}\n`
      );
    } else {
      console.log(`=( This page ${item.url} have no Title`);
    }
    await browser.close(); // <-- закрываем браузер
  }
  checkUrlTitle(item);
});
