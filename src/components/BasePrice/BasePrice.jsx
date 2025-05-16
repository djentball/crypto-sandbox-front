import React, { useState } from "react";
import './BasePrice.css';

const BasePriceSetter = () => {
  const [price, setPrice] = useState("");

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
    } catch (error) {
      console.error("Помилка:", error);
    }
  };

  return (
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
  );
};

export default BasePriceSetter;
