import axios from "axios";
import { useCallback, useEffect, useState } from "react";
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
    if (cryptoCurrencyData.rates[currency])
      handleFirstAmountChange(amount, cryptoCurrencyData.rates[currency]);
  }, [cryptoCurrencyData.currency, cryptoCurrencyData.rates]);

  const handleFirstAmountChange = useCallback((amount, rate) => {
    setCryptoAmount(amount / rate);
    setAmount(amount);
  }, []);

  const handleFirstCurrencyChange = useCallback(({ rate, currency }) => {
    setCryptoAmount(amount / rate);
    setCurrency(currency);
  }, []);

  const handleSecoundAmountChange = useCallback((amount, rate) => {
    setAmount(amount * rate);
    setCryptoAmount(amount);
  }, []);

  const handleSecondCurrencyChange = useCallback(({ currency }) => {
    getCurrencyExchangeRates(currency);
  }, []);

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
              cryptoCurrencyData={cryptoCurrencyData}
              handleAmountChange={handleFirstAmountChange}
              handleCurrencyChange={handleFirstCurrencyChange}
            />
            <CurrencyInput
              amount={cryptoAmount}
              activeCurrency={currency}
              currency={cryptoCurrencyData.currency}
              currencies={INITIAL_CRYPTO_CURRENCIES}
              cryptoCurrencyData={cryptoCurrencyData}
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
