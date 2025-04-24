import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { useParams } from 'react-router-dom';

const CryptoDetails = () => {
  const { id } = useParams();
  const [chartData, setChartData] = useState([]);
  const [coinInfo, setCoinInfo] = useState(null);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [chartRes, infoRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/crypto/market-chart/${id}?days=${days}`),
        axios.get(`https://api.coingecko.com/api/v3/coins/${id}`),
      ]);

      const prices = chartRes.data.prices.map(([timestamp, price]) => {
        const date = new Date(timestamp);
        return {
          date: `${date.getMonth() + 1}/${date.getDate()}`,
          price: parseFloat(price.toFixed(2)),
        };
      });

      setChartData(prices);
      setCoinInfo(infoRes.data);
    } catch (err) {
      console.error('Error fetching crypto data:', err);
      setError('Failed to load crypto details. Please try again later.');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id, days]);

  if (loading) {
    return (
      <div className="p-10 text-center text-lg text-gray-600">
        Loading crypto details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <img src={coinInfo.image.large} alt={coinInfo.name} className="w-14 h-14" />
          <div>
            <h1 className="text-3xl font-bold text-blue-700">{coinInfo.name}</h1>
            <p className="text-gray-600 uppercase">{coinInfo.symbol}</p>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-700">Price Chart (Last {days} Days)</h2>
          <select
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <option value={1}>1 Day</option>
            <option value={7}>7 Days</option>
            <option value={14}>14 Days</option>
            <option value={30}>30 Days</option>
          </select>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h3 className="text-sm text-gray-500">Current Price</h3>
            <p className="text-lg font-semibold">
              ${coinInfo.market_data.current_price.usd.toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Market Cap</h3>
            <p className="text-lg font-semibold">
              ${coinInfo.market_data.market_cap.usd.toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">24h Change</h3>
            <p
              className={`text-lg font-semibold ${
                coinInfo.market_data.price_change_percentage_24h >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {coinInfo.market_data.price_change_percentage_24h.toFixed(2)}%
            </p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Total Volume</h3>
            <p className="text-lg font-semibold">
              ${coinInfo.market_data.total_volume.usd.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetails;
