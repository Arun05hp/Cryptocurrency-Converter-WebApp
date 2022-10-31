import React, { useState } from "react";

const CurrencyInput = ({
  amount,
  currency,
  currencies,
  handleAmountChange,
  handleCurrencyChange,
}) => {
  const initialValue = {
    visible: false,
    allCurrencies: currencies,
  };

  const [modalData, setModalData] = useState(initialValue);

  function handleCloseModal() {
    setModalData(initialValue);
  }

  function handleOpenModal() {
    setModalData((prev) => ({ ...prev, visible: true }));
  }

  function handleFilterList(value) {
    setModalData((prev) => ({
      ...prev,
      allCurrencies: value
        ? currencies.filter((currency) =>
            JSON.stringify(currency).toLowerCase().includes(value.toLowerCase())
          )
        : currencies,
    }));
  }

  return (
    <>
      <div className="input-group bg-gray">
        <input
          type={"number"}
          value={amount}
          onChange={(event) => {
            handleAmountChange(event.target.value.replace(/[^0-9_.]/g, ""));
          }}
        />
        <div
          className="flex items-center justify-between selected-currency bg-gray-secondary"
          onClick={handleOpenModal}
        >
          <p>{currency}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="down-arrow-icon"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
          </svg>
        </div>
      </div>

      {modalData.visible && (
        <div className="modal">
          <div className="modal-content flex flex-col rounded-lg p-5">
            <div className="heading mb-2 flex items-center justify-between">
              <p>Select a currency</p>
              <button className="close-btn" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <input
              className="search-box bg-gray rounded-md mb-4"
              placeholder="Search"
              onChange={(event) => handleFilterList(event.target.value)}
            />
            {modalData.allCurrencies?.length === 0 ? (
              <p className="text-info">No records founds</p>
            ) : (
              <ul className="list-wrapper">
                {modalData.allCurrencies.map((currency) => (
                  <li
                    className="list-item p-2 rounded-md"
                    key={currency.value}
                    onClick={() => {
                      handleCurrencyChange(currency.value);
                      handleCloseModal();
                    }}
                  >
                    {currency.value} - {currency.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CurrencyInput;
