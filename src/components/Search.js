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
          width: "290px",
          margin: "1px",
          height: "290px",
          border: "2px solid",

          boxShadow: "5px 10px #888888",
        }}
        className={
          item.price_change_percentage_24h < 0
            ? "card border-danger mb-3"
            : "card border-success mb-3"
        }
      >
        <div className="card-header">{item.name}</div>
        <div className="card-body">
          <img
            style={{
              height: "84px",
            }}
            src={item.image}
            alt="crypto"
          />
          <div style={{ marginTop: "10px" }}>
            <h4
              className="card-text"
              style={{
                marginTop: "25px",
                display: "inline",
              }}
            >
              <strong style={{ color: "black" }}>{item.current_price}$</strong>
            </h4>
          </div>
          <hr></hr>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              style={{ margin: "2px", borderRadius: "3px", width: "40%" }}
              type="button"
              className="btn btn-success"
              onClick={Add}
            >
              BUY
            </button>
            {walletItem && (
              <button
                style={{ margin: "2px", borderRadius: "3px", width: "40%" }}
                type="button"
                className="btn btn-dark"
              >
                x{(walletItem && walletItem.amount) || null}
              </button>
            )}
            {!walletItem && (
              <button
                style={{ margin: "2px", borderRadius: "3px", width: "40%" }}
                type="button"
                disabled={true}
                className={
                  item.price_change_percentage_24h < 0
                    ? "btn btn-outline-danger"
                    : "btn btn-outline-success"
                }
              >
                {item.market_cap_change_percentage_24h.toFixed(2)}%
              </button>
            )}

            {walletItem && (
              <button
                style={{ margin: "2px", borderRadius: "3px", width: "40%" }}
                type="button"
                disabled={!walletItem}
                className="btn btn-danger"
                onClick={Remove}
              >
                SELL
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
