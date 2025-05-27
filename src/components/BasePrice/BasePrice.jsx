import React, { useState, useEffect } from "react";
import './BasePrice.css';
import { showErrorToast, showSuccessToast } from '../Toast/ShowToast';
import { useSymbol } from '../../context/SymbolContext';

const API_URL = import.meta.env.VITE_API_URL;
const USER_ID = import.meta.env.VITE_USER_ID;

const BasePriceSetter = () => {
  const [price, setPrice] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [currentBasePrice, setCurrentBasePrice] = useState(null);
  const [currentBalance, setBalance] = useState(null);
  const { selectedSymbol } = useSymbol();
  const [cryptoBalances, setCryptoBalances] = useState({});

  useEffect(() => {
    if (!selectedSymbol) return;
    fetchBasePrice();
    fetchBalance();
  }, [selectedSymbol]);

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  };

  const handleBuyAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setBuyAmount(value);
    }
  };

  const handleSellAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setSellAmount(value);
    }
  };

  const handleSubmitBasePrice = async () => {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) return;
    try {
      const response = await fetch(`${API_URL}/trade/base-price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: selectedSymbol, price: parsedPrice }),
      });
      if (!response.ok) throw new Error("Помилка при відправці базової ціни");
      setPrice("");
      showSuccessToast("Базову ціну успішно встановлено");
      await fetchBasePrice();
    } catch (error) {
      showErrorToast("Помилка встановлення базової ціни");
      console.error("Помилка:", error);
    }
  };

  const handleBuy = async () => {
    const quantity = parseFloat(buyAmount);
    if (isNaN(quantity) || quantity <= 0) return;
    try {
      const response = await fetch(`${API_URL}/trade/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: selectedSymbol, quantity, user_id: USER_ID }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail, null, 2);
        showErrorToast(`Помилка покупки: ${message}`);
      } else {
        showSuccessToast(`Куплено ${buyAmount} ${selectedSymbol} на ${data.total_cost} USD`);
        setBuyAmount("");
        await fetchBalance();
      }
    } catch (error) {
      showErrorToast("Помилка при купівлі");
      console.error("Помилка при купівлі:", error);
    }
  };

  const handleSell = async () => {
    const quantity = parseFloat(sellAmount);
    if (isNaN(quantity) || quantity <= 0) return;
    try {
      const response = await fetch(`${API_URL}/trade/sell`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: selectedSymbol, quantity, user_id: USER_ID }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail, null, 2);
        showErrorToast(`Помилка продажу: ${message}`);
      } else {
        showSuccessToast(`Продано ${sellAmount} ${selectedSymbol}`);
        setSellAmount("");
        await fetchBalance();
      }
    } catch (error) {
      showErrorToast("Помилка при продажу");
      console.error("Помилка при продажу:", error);
    }
  };

  const fetchBasePrice = async () => {
    try {
      const response = await fetch(`${API_URL}/trade/base-price/${selectedSymbol.toLowerCase()}`);
      const data = await response.json();
      setCurrentBasePrice(data['price']);
    } catch (error) {
      console.error("Помилка при отриманні базової ціни:", error);
      setCurrentBasePrice(null);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${USER_ID}/balance`);
      const data = await response.json();
      setBalance(data['total_balance_usd']);
      setCryptoBalances(data['crypto']);
    } catch (error) {
      console.error("Помилка при отриманні балансу:", error);
      setBalance(null);
      setCryptoBalances({});
    }
  };

  return (
    <>
      <div className="base-price-container">
        <input
          type="text"
          value={price}
          onChange={handlePriceChange}
          placeholder="Введіть базову ціну"
          className="base-price input"
        />
        <button
          onClick={handleSubmitBasePrice}
          disabled={price === ""}
          className="base-price button"
        >
          Встановити ціну
        </button>
      </div>

      <div className="trade-container">
        <div className="trade-box">
          <input
            type="text"
            value={buyAmount}
            onChange={handleBuyAmountChange}
            placeholder="Кількість для купівлі"
            className="base-price input"
          />
          <button onClick={handleBuy} className="base-price button" disabled={buyAmount === ""}>Купити</button>
        </div>

        <div className="trade-box">
          <input
            type="text"
            value={sellAmount}
            onChange={handleSellAmountChange}
            placeholder="Кількість для продажу"
            className="base-price input"
          />
          <button onClick={handleSell} className="base-price button" disabled={sellAmount === ""}>Продати</button>
        </div>
      </div>

      <div className="info">
        <div className="base-price-btc">
          Base price {selectedSymbol}: {currentBasePrice !== null ? currentBasePrice : "Завантаження..."}
        </div>
        <div className="balance">
          Balance: {currentBalance !== null ? currentBalance : "Завантаження..."}
        </div>
        <div className="crypto-balance">
          Balance {selectedSymbol}: {cryptoBalances[selectedSymbol]?.amount ?? "Завантаження..."}
        </div>
      </div>
    </>
  );
};

export default BasePriceSetter;
