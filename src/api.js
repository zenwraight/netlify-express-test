const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

// This is to fetch current price of stock delayed by every 30 minutes
const getLastStockPrice = async (stockSymbol) => {
  console.log("Fetch stock price for " + stockSymbol);

  const url = "https://api.nasdaq.com/api/quote/"+stockSymbol+"/info?assetclass=stocks";

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  await fetch(url)
    .then(response => response.text())
    .then(result => {
      const resultJson = JSON.parse(result);
      if (resultJson.data != null) {
        const stockLastPriceInfo = {
          symbol: stockSymbol,
          lastSalePrice: resultJson.data.primaryData.lastSalePrice,
          netChange: resultJson.data.primaryData.netChange,
          percentageChange: resultJson.data.primaryData.percentageChange,
          deltaIndicator: resultJson.data.primaryData.deltaIndicator,
        };
        console.log(stockLastPriceInfo);

        //redisClient.set(stockSymbol+"_info", JSON.stringify(stockLastPriceInfo));
      }
    })
    .catch(err => {
      console.log(err);
    })
}

router.get("/", (req, res) => {
  console.log("Inside api method");
  res.json({
    hello: "hi!"
  });
});

router.get("/test", (req, res) => {
  console.log("STARTED stock price fetch");
  getLastStockPrice("AAPL");
  console.log("COMPLETED Stock fetch");
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
