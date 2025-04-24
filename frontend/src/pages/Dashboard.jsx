import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState("");

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 10,
            page: 1,
            sparkline: false,
          },
        });
        setCoins(res.data);
        if (res.data.length > 0) {
          setSelectedCoin(res.data[0].id); // Default to first coin
        }
      } catch (err) {
        console.error("Failed to fetch coin list", err);
      }
    };

    fetchCoins();
  }, []);

  const handleViewDetails = () => {
    if (selectedCoin) {
      navigate(`/crypto/${selectedCoin}`);
    } else {
      alert("Please select a coin first.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-100 to-indigo-100 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">🪙 Crypto Dashboard</h1>

        <div className="space-y-5">
          {/* Coin Dropdown */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Choose a Coin:</label>
            <select
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
            >
              {coins.map((coin) => (
                <option key={coin.id} value={coin.id}>
                  {coin.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleViewDetails}
            className="w-full bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            📈 View Crypto Detailed Analysis
          </button>

          <button
            onClick={() => navigate("/top-movers")}
            className="w-full bg-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-600 transition"
          >
            🚀 View Top Gainers & Losers
          </button>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="text-red-500 hover:underline text-sm"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
