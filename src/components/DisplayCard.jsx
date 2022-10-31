import React, { useEffect, useState } from "react";

const DisplayCard = ({
  flip,
  isFetching,
  amount,
  currency,
  cryptoAmount,
  cryptoCurrency,
  getCurrencyExchangeRates,
}) => {
  const [seconds, setSeconds] = useState(30);

  function resetCountDown() {
    setSeconds(30);
  }

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        getCurrencyExchangeRates();
      }
    }, 1000);

    return () => {
      clearInterval(myInterval);
    };
  }, [seconds]);

  useEffect(() => {
    if (!isFetching) {
      resetCountDown();
    }
  }, [isFetching]);

  function formatNumber(number) {
    return isNaN(number)
      ? 0
      : number.toString()?.length > 18
      ? Number(number).toFixed(18)
      : number;
  }

  return (
    <>
      <div className="flex items-center justify-between flex-wrap text-sm mt-4 mb-2">
        <p>Summary</p>
        <p>{isFetching ? "Re-quoting" : `Quote updates in ${seconds}s`}</p>
      </div>

      <div className="bg-gray rounded-md p-2">
        {flip ? (
          <p>
            You get{" "}
            <b>
              {" "}
              {formatNumber(amount)} {currency}
            </b>{" "}
            for{" "}
            <b>
              {formatNumber(cryptoAmount)} {cryptoCurrency}
            </b>
          </p>
        ) : (
          <p>
            You get{" "}
            <b>
              {formatNumber(cryptoAmount)} {cryptoCurrency}
            </b>{" "}
            for{" "}
            <b>
              {formatNumber(amount)} {currency}
            </b>
          </p>
        )}
      </div>
    </>
  );
};

export default DisplayCard;
