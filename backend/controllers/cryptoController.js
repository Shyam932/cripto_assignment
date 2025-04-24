const axios = require("axios");
const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

const isValidCoin = (coin) => {
  return (
    coin &&
    coin.price_change_percentage_24h !== 0 &&
    coin.market_cap > 1000000
  );
};

// GET /api/crypto/market-chart/:id?days=7
exports.getMarketChart = async (req, res) => {
  const { id } = req.params;
  const days = req.query.days || 7;

  if (!id) {
    return res.status(400).json({ error: "Missing coin ID." });
  }

  try {
    const response = await axios.get(
      `${COINGECKO_BASE}/coins/${id}/market_chart`,
      {
        params: {
          vs_currency: "usd",
          days,
        },
      }
    );

    if (!response.data || !response.data.prices) {
      throw new Error("Invalid chart data from CoinGecko.");
    }

    res.status(200).json(response.data);
  } catch (err) {
    console.error(
      "Error fetching market chart:",
      err.response?.data || err.message || err
    );
    res.status(500).json({ error: "Error fetching market chart data." });
  }
};

// GET /api/crypto/top-gainers
exports.getTopGainers = async (req, res) => {
  try {
    const response = await axios.get(`${COINGECKO_BASE}/coins/markets`, {
      params: {
        vs_currency: "usd",
        order: "price_change_percentage_24h_desc",
        per_page: 100,
        page: 1,
      },
    });

    const top3 = response.data
      .filter(
        (coin) => coin.market_cap_rank && coin.price_change_percentage_24h > 0
      )
      .slice(0, 3);

    res.status(200).json(top3);
  } catch (err) {
    console.error(
      "Error in getTopGainers:",
      err.response?.data || err.message || err
    );
    res.status(500).json({ error: "Error fetching top gainers." });
  }
};

// GET /api/crypto/top-losers
exports.getTopLosers = async (req, res) => {
  try {
    const response = await axios.get(`${COINGECKO_BASE}/coins/markets`, {
      params: {
        vs_currency: "usd",
        order: "price_change_percentage_24h_asc",
        per_page: 100,
        page: 1,
      },
    });

    const top3 = response.data
      .filter(
        (coin) => coin.market_cap_rank && coin.price_change_percentage_24h < 0
      )
      .slice(0, 3);

    res.status(200).json(top3);
  } catch (err) {
    console.error(
      "Error in getTopLosers:",
      err.response?.data || err.message || err
    );
    res.status(500).json({ error: "Error fetching top losers." });
  }
};
