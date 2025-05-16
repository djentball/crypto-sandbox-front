import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
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

const CryptoChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('https://api-aio.alwaysdata.net/crypto/prices?symbol=BTCUSDT&limit=50')
      .then(response => {
        const data = response.data.reverse(); // Реверс, щоб час ішов зліва направо

        const labels = data.map(item => item.timestamp);
        const prices = data.map(item => item.close);

        setChartData({
          labels,
          datasets: [
            {
              label: 'BTC/USDT',
              data: prices,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.3,
              fill: true,
            }
          ]
        });
      })
      .catch(error => {
        console.error('Помилка при завантаженні даних:', error);
      });
  }, []);

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
          unit: 'minute',
          tooltipFormat: 'yyyy-MM-dd HH:mm'
        },
        title: {
          display: true,
          text: 'Час'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Ціна (USDT)'
        }
      }
    }
  };

  return (
    <div>
      <h2>Графік ціни BTC/USDT</h2>
      {chartData ? <Line data={chartData} options={options} /> : <p>Завантаження даних...</p>}
    </div>
  );
};

export default CryptoChart;
