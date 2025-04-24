import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopGainersLosers = () => {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTop = async () => {
    try {
      const resGainers = await axios.get('http://localhost:5000/api/crypto/top-gainers');
      setGainers(resGainers.data);

      setTimeout(async () => {
        const resLosers = await axios.get('http://localhost:5000/api/crypto/top-losers');
        setLosers(resLosers.data);
        setLoading(false);
      }, 500); // delay to avoid rate limiting
    } catch (err) {
      console.error('Failed to fetch top gainers/losers:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTop();
  }, []);

  const Card = ({ coin, type }) => (
    <div className={`w-full md:w-1/3 p-4 rounded-lg shadow-lg ${type === 'gainer' ? 'bg-green-100' : 'bg-red-100'}`}>
      <div className="flex items-center gap-3 mb-2">
        <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
        <h3 className={`text-lg font-semibold ${type === 'gainer' ? 'text-green-700' : 'text-red-700'}`}>
          {coin.name} ({coin.symbol.toUpperCase()})
        </h3>
      </div>
      <p className="text-gray-700">Price: ${coin.current_price}</p>
      <p className={`${type === 'gainer' ? 'text-green-600' : 'text-red-600'} font-semibold`}>
        Change: {coin.price_change_percentage_24h.toFixed(2)}%
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-gray-700">
        Loading top movers...
      </div>
    );
  }

  return (
    <div className="px-4 py-8 space-y-8">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">🚀 Top 3 Gainers</h2>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        {gainers.map((coin, index) => (
          <Card key={index} coin={coin} type="gainer" />
        ))}
      </div>

      <h2 className="text-2xl font-bold text-center text-red-700 mt-10 mb-4">📉 Top 3 Losers</h2>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        {losers.map((coin, index) => (
          <Card key={index} coin={coin} type="loser" />
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={fetchTop}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow"
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
};

export default TopGainersLosers;
