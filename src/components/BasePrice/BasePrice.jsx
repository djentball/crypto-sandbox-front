import React, { useState, useEffect } from "react";
import './BasePrice.css';

const BasePriceSetter = () => {
  const [price, setPrice] = useState("");
  const [currentBasePrice, setCurrentBasePrice] = useState(null);

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

  useEffect(() => {
    fetchBasePrice();
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
      <div className="base-price-info">
      Base price BTC: {currentBasePrice !== null ? currentBasePrice : "Завантаження..."}
    </div>
    </>
  );
};

export default BasePriceSetter;
