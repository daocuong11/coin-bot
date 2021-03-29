const Binance = require('node-binance-api');
var RSI = require('technicalindicators').RSI;
const TelegramBot = require('node-telegram-bot-api');

const binance = new Binance().options({
  APIKEY: '8IaVnQXPSZlAYngh1OThvIQj7xCVlhFzvJrOlztPzggaFOdFohzUZ7tLPRvogXrt',
  APISECRET: '3WbICvzBCGq6xT1p7kZVtEjf6E1WO40KGYi5nKX0FEyi0K1kiPhMh1VAzgoiuAyw'
});

const bot = new TelegramBot('1784948213:AAFFIuHqiI01aaOhGEg2m_Uq28CLbwL-I2E', { polling: true });

let time_candlesticks = "1h";
let chatId = "711570900";

let coin_symbols = ["SXPUSDT"];

/** Duyệt danh sách coin tính rsi */
coin_symbols.forEach(coin_symbol => {
  binance.candlesticks(coin_symbol, time_candlesticks, (error, ticks, symbol) => {
    let prices = ticks.map(e => e[4]);
    prices = prices.slice(0, -1);       // bỏ cây nến hiện tại

    let rsi14 = getRSI(prices, 14);
    let rsi21 = getRSI(prices, 21);

    let isProcess = (rsi14 > 70 && rsi21 > 70) || (rsi14 < 30 && rsi21 < 30);

    console.info(`${symbol} rsi-14 ${rsi14} rsi-21 ${rsi21}`);

    if (isProcess) {
      let msg = `${symbol} đang có entry đẹp rsi-14 ${rsi14} rsi-21 ${rsi21}`;
      bot.sendMessage(chatId, msg);
    }
  }, { limit: 102 });
});

function getRSI(prices, period) {
  let inputRSI = { values: prices, period };
  return getLastItem(RSI.calculate(inputRSI));
}

function getLastItem(arr) {
  return arr[arr.length - 1];
}