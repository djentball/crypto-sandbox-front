import React, { useState, useEffect } from "react";
import './BasePrice.css';

const BasePriceSetter = () => {
  const [price, setPrice] = useState("");
  const [currentBasePrice, setCurrentBasePrice] = useState(null);
  const [currentBalance, setBalance] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  };

  const handleSubmit = async () => {
    if (price === "") return;

    try {
      const response = await fetch("https://api-aio.alwaysdata.net/crypto/trade/base-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: "BTCUSDT",
          price: parseFloat(price),
        }),
      });

      if (!response.ok) {
        throw new Error("Помилка при відправці запиту");
      }

      setPrice("");
      await fetchBasePrice(); // оновити базову ціну після відправки

    } catch (error) {
      console.error("Помилка:", error);
    }
  };

  const fetchBasePrice = async () => {
    try {
      const response = await fetch("https://api-aio.alwaysdata.net/crypto/trade/base-price/btcusdt");
  
      if (!response.ok) {
        throw new Error("Помилка при відправці запиту");
      }
  
      const data = await response.json();
      setCurrentBasePrice(data['price']);
  
    } catch (error) {
      console.error("Помилка при отриманні базової ціни:", error);
      setCurrentBasePrice(null);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await fetch("https://api-aio.alwaysdata.net/crypto/users/dbfb7742-7cc2-4ddf-8dff-fed0e75ad352/balance");
  
      if (!response.ok) {
        throw new Error("Помилка при відправці запиту");
      }
  
      const data = await response.json();
      setBalance(data['total_balance_usd']);
  
    } catch (error) {
      console.error("Помилка при отриманні балансу:", error);
      setBalance(null);
    }
  };

  useEffect(() => {
    fetchBasePrice();
    fetchBalance();
  }, []);

  return (
    <>
      <div className="base-price-container">
        <input
          type="text"
          value={price}
          onChange={handleInputChange}
          placeholder="Введіть ціну"
          className="base-price input"
        />
        <button
          onClick={handleSubmit}
          disabled={price === ""}
          className="base-price button"
        >
          Надіслати
        </button>
        
      </div>
      <div className="info">
      <div className="base-price-btc">
      Base price BTC: {currentBasePrice !== null ? currentBasePrice : "Завантаження..."}
    </div>
    <div className="balance">
      Balance: {currentBalance !== null ? currentBalance : "Завантаження..."}
    </div>
    </div>
    </>
  );
};

export default BasePriceSetter;
