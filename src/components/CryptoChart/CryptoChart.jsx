import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import reloadIcon from '../../assets/reload.svg';
import './CryptoChart.css';
import { useSymbol } from '../../context/SymbolContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, TimeScale);

const API_URL = import.meta.env.VITE_API_URL;

const CRYPTOS = [
  { label: 'Bitcoin (BTC)', symbol: 'BTCUSDT' },
  { label: 'Ripple (XRP)', symbol: 'XRPUSDT' },
  { label: 'Ethereum (ETH)', symbol: 'ETHUSDT' },
];

const CryptoChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const { selectedSymbol, setSelectedSymbol } = useSymbol();
  

  const fetchChartData = async (symbol) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/prices?symbol=${symbol}&limit=70`);
      const data = response.data.reverse();
      const labels = data.map(item => {
        const date = new Date(item.timestamp);
        date.setHours(date.getHours() + 3); // UTC+3
        return date;
      });
      const prices = data.map(item => item.close);
  
      setChartData({
        labels,
        datasets: [
          {
            label: `${symbol}`,
            data: prices,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.3,
            fill: true,
          }
        ]
      });
    } catch (error) {
      console.error('Помилка при завантаженні даних:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchChartData(selectedSymbol);
  }, [selectedSymbol]);

  const handleReload = () => {
    setLoading(true);
    axios.post(`${API_URL}/binance/import?symbol=${selectedSymbol}&interval=1h&limit=70`)
      .then(() => {
        fetchChartData(selectedSymbol);
      })
      .catch(error => {
        console.error('Помилка при оновленні даних:', error);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    setSelectedSymbol(e.target.value);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          stepSize: 5,
          tooltipFormat: 'yyyy-MM-dd HH:mm',
          displayFormats: {
            hour: 'HH'
          }
        }
      },
      y: {
        position: 'right',
        title: {
          display: true,
          text: 'Ціна (USDT)'
        }
      }
    }
  };

  return (
    <div className='chart'>
      <h2>Графік ціни {selectedSymbol}</h2>

      <div className="chart-controls">
        <select value={selectedSymbol} onChange={handleChange}>
          {CRYPTOS.map(crypto => (
            <option key={crypto.symbol} value={crypto.symbol}>{crypto.label}</option>
          ))}
        </select>

        <button className='reload-button button' onClick={handleReload} disabled={loading}>
          {loading ? 'Оновлення...' : <img src={reloadIcon} alt="Reload" width={24} height={24} />}
        </button>
      </div>

      {chartData ? <Line data={chartData} options={options} /> : <p>Завантаження даних...</p>}
    </div>
  );
};

export default CryptoChart;
