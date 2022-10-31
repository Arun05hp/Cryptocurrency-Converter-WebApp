import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import CurrencyInput from "./components/CurrencyInput";
import DisplayCard from "./components/DisplayCard";
import FlipButton from "./components/FlipButton";
import { INITIAL_CRYPTO_CURRENCIES } from "./constants";

function App() {
  const [amount, setAmount] = useState(1);
  const [cryptoAmount, setCryptoAmount] = useState(1);
  const [currency, setCurrency] = useState("USD");
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flip, setFlip] = useState(false);
  const [cryptoCurrencyData, SetCryptoCurrencyData] = useState({
    currency: "ETH",
    rates: {},
    isFetching: false,
  });

  function getCurrencies() {
    axios.get("https://api.coinbase.com/v2/currencies").then((response) => {
      const { data } = response.data;
      setCurrencies(data);
    });
  }

  function getCurrencyExchangeRates(currency = cryptoCurrencyData.currency) {
    SetCryptoCurrencyData((prev) => ({ ...prev, isFetching: true }));
    axios
      .get(`https://api.coinbase.com/v2/exchange-rates?currency=${currency}`)
      .then((response) => {
        const { data } = response.data;
        SetCryptoCurrencyData({ ...data, isFetching: false });

        if (loading) setLoading(false);
      });
  }

  function handleToggleFlip() {
    setFlip((prev) => !prev);
  }

  useEffect(() => {
    getCurrencies();
    getCurrencyExchangeRates();
  }, []);

  useEffect(() => {
    handleFirstAmountChange(amount);
  }, [cryptoCurrencyData.currency, cryptoCurrencyData.rates]);

  function validateCurrencyRateExists(currency) {
    return cryptoCurrencyData.rates[currency];
  }

  function handleFirstAmountChange(amount) {
    if (!validateCurrencyRateExists(currency)) return;
    setCryptoAmount(amount / cryptoCurrencyData.rates[currency]);
    setAmount(amount);
  }

  function handleFirstCurrencyChange(currency) {
    if (!validateCurrencyRateExists(currency)) return;
    setCryptoAmount(amount / cryptoCurrencyData.rates[currency]);
    setCurrency(currency);
  }

  function handleSecoundAmountChange(amount) {
    if (!validateCurrencyRateExists(currency)) return;
    setAmount(amount * cryptoCurrencyData.rates[currency]);
    setCryptoAmount(amount);
  }

  function handleSecondCurrencyChange(currency) {
    getCurrencyExchangeRates(currency);
  }

  return (
    <div className="container rounded-lg p-5 ">
      <h1 className="heading mb-4">Currency Converter </h1>

      {loading ? (
        <p>Loading ...</p>
      ) : (
        <>
          <div className={`relative flex flex-col${flip ? "-reverse" : ""}`}>
            <CurrencyInput
              amount={amount}
              currency={currency}
              currencies={currencies.map((currency) => ({
                value: currency.id,
                label: currency.name,
              }))}
              handleAmountChange={handleFirstAmountChange}
              handleCurrencyChange={handleFirstCurrencyChange}
            />
            <CurrencyInput
              amount={cryptoAmount}
              currency={cryptoCurrencyData.currency}
              currencies={INITIAL_CRYPTO_CURRENCIES}
              handleAmountChange={handleSecoundAmountChange}
              handleCurrencyChange={handleSecondCurrencyChange}
            />
            <FlipButton onClick={handleToggleFlip} />
          </div>

          <DisplayCard
            flip={flip}
            isFetching={cryptoCurrencyData.isFetching}
            amount={amount}
            currency={currency}
            cryptoAmount={cryptoAmount}
            cryptoCurrency={cryptoCurrencyData.currency}
            getCurrencyExchangeRates={getCurrencyExchangeRates}
          />
        </>
      )}
    </div>
  );
}

export default App;
