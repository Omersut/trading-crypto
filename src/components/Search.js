import { useEffect, useState } from "react";
import { useList } from "../context/ListContext";

function Search({
  item,
  key,
  name,
  image,
  symbol,
  marketcap,
  price,
  priceChange,
  volume,
}) {
  // context basket
  const { addToList, wallet, setWallet, removeFromList, usd, setUSD } =
    useList();
  const walletItem = wallet.find((a) => a.id === item.id);

  const Add = () => {
    if (usd > item.current_price) {
      setUSD(usd - item.current_price);

      addToList(item);
    }
  };
  const Remove = () => {
    setUSD(usd + item.current_price);
    removeFromList(item);
  };

  return (
    <>
      <div
        style={{
          width: "250px",
          margin: "7px",
          height: "250px",
        }}
        className={
          priceChange < 0
            ? "card border-danger mb-3"
            : "card border-success mb-3"
        }
      >
        <div className="card-header">{item.name}</div>
        <div className="card-body">
          <img
            style={{
              height: "88px",
            }}
            src={item.image}
            alt="crypto"
          />
          <div style={{ marginTop: "12px" }}>
            <h4
              className="card-text"
              style={{
                marginTop: "25px",
                display: "inline",
              }}
            >
              <strong style={{ color: "black" }}>
                {(walletItem && walletItem.amount) || 0}
              </strong>
            </h4>
          </div>
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              style={{ margin: "5px", height: "41px", width: "45%" }}
              type="button"
              className="btn btn-success"
              onClick={Add}
            >
              BUY
            </button>
            <button
              style={{ margin: "5px", width: "45%" }}
              type="button"
              className={
                priceChange < 0
                  ? "btn btn-outline-danger"
                  : "btn btn-outline-success"
              }
            >
              {item.market_cap_change_percentage_24h}%
            </button>
            <button
              style={{ margin: "5px", height: "41px", width: "45%" }}
              type="button"
              disabled={!walletItem}
              className="btn btn-danger"
              onClick={Remove}
            >
              ✗
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
