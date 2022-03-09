import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useList } from "../context/ListContext";
import Search from "./Search";
import WalletList from "./WalletList";
import { moneyFormat } from "../helpers";

function List({ username }) {
  const [page, setPage] = useState(76);
  const { wallet, usd, setUSD, items } = useList();
  const [list, setList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [total, setTotal] = useState(
    JSON.parse(localStorage.getItem("total")) || 100000
  );

  const data = () => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${page}&page=1&sparkline=false`
    )
      .then((res) => res.json())
      .then((res) => setList(res))
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    data();

    const t = wallet.reduce((acc, item) => {
      return (
        acc +
        item.amount * items.find((coin) => coin.id === item.id).current_price
      );
    }, 0);
    setInterval(setTotal(usd + t), 2000);

    localStorage.setItem("usd", JSON.stringify(usd));
    localStorage.setItem("total", JSON.stringify(total));
    localStorage.setItem("t", JSON.stringify(t));
    localStorage.setItem("wallet", JSON.stringify(wallet));
    localStorage.setItem("items", JSON.stringify(items));
  }, [wallet, page, total]);

  const filteredCoins = list.filter((item) =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      <nav
        style={{
          boxShadow: "0px 10px #1E90FF",
        }}
        className="navbar navbar-expand-lg navbar-dark bg-black position-sticky fixed-top"
      >
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <h5>crypto</h5>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarScroll"
            aria-controls="navbarScroll"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarScroll">
            <ul
              className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"
              style={{ bsScrollHeight: "100px" }}
            >
              <li className="nav-item" style={{ marginLeft: "5px" }}>
                <button
                  style={{ margin: "3px", border: "solid 1px black" }}
                  className="btn btn-primary"
                  type="button"
                  onClick={data}
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseExample"
                  aria-expanded="false"
                  aria-controls="collapseExample"
                >
                  Profile
                </button>
                <button
                  style={{ margin: "3px", border: "solid 1px black" }}
                  className="btn btn-warning"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasRight"
                  aria-controls="offcanvasRight"
                >
                  Wallet <span className="badge bg-dark">{wallet.length}</span>
                </button>
              </li>

              <li className="nav-item">
                <button
                  style={{ margin: "3px", border: "solid 1px black" }}
                  className={
                    total < 100000 ? "btn btn-danger" : "btn btn-success"
                  }
                >
                  📈{" "}
                  <span style={{ fontSize: "13px" }} className="badge bg-dark">
                    {moneyFormat(total)}
                  </span>
                </button>
                <button
                  style={{ margin: "3px", border: "solid 1px black" }}
                  className={total < 100000 ? "btn btn-dark" : "btn btn-dark"}
                >
                  USD{" "}
                  <span style={{ fontSize: "13px" }} className="badge bg-dark">
                    {moneyFormat(usd)}
                  </span>
                </button>
              </li>
            </ul>
            <form className="d-flex">
              <input
                style={{ marginRight: "10px" }}
                className="form-control me-2"
                aria-label="c"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                type="text"
                placeholder="Coin Name"
              />
              <button className="btn btn-outline-primary" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div style={{ marginTop: "15px" }}>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Settings
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="col-form-label">Theme</label>
                  <div>
                    <button
                      style={{ margin: "5px" }}
                      className="btn btn-dark"
                      type="submit"
                    >
                      Dark
                    </button>
                    <button
                      style={{ margin: "5px" }}
                      className="btn btn-outline-dark"
                      type="submit"
                    >
                      Light
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="collapse" id="collapseExample">
          <div className="card card-body">
            <h2 style={{ margin: "20px" }}>
              <span
                style={{
                  boxShadow: "5px 10px #888888",
                  border: "4px solid #1E90FF",
                  padding: "8px",
                  borderRadius: "5px",
                }}
              >
                {username}
              </span>
            </h2>
            <span style={{ marginTop: "20px" }}>
              <button
                style={{ margin: "5px" }}
                type="button"
                className="btn btn-outline-dark"
              >
                TOTAL: {moneyFormat(total)}$
              </button>
              <button
                style={{ margin: "5px" }}
                type="button"
                className="btn btn-outline-dark"
              >
                {moneyFormat(usd)} USD
              </button>
              <button
                style={{
                  margin: "3px",
                  border: "solid 1px black",
                }}
                type="button"
                className="btn btn-dark"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                data-bs-whatever="@mdo"
              >
                ⚙️
              </button>
              <a href="/">
                <button
                  style={{
                    margin: "3px",
                    border: "solid 1px black",
                  }}
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => localStorage.clear()}
                >
                  LogOut
                </button>
              </a>
            </span>
            <span></span>
          </div>
        </div>

        <div
          className="offcanvas offcanvas-end"
          tabIndex={-1}
          id="offcanvasRight"
          aria-labelledby="offcanvasRightLabel"
        >
          <div className="offcanvas-header">
            <h5 id="offcanvasRightLabel">Wallet</h5>
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </div>
          <div className="offcanvas-body">
            <span>
              <button
                style={{ margin: "5px" }}
                type="button"
                className="btn btn-outline-dark"
              >
                TOTAL: {moneyFormat(total)}$
              </button>
              <button
                style={{ margin: "5px" }}
                type="button"
                className="btn btn-outline-dark"
              >
                {moneyFormat(usd)} USD
              </button>
            </span>
            <div style={{ padding: "2rem 3rem" }} className="container">
              <div className="row">
                <div className="col-12 col-sm-12 col-lg-12">
                  <ul className="list-group">
                    {items.map((item, i) => (
                      <span key={i}>
                        <WalletList item={item} />
                      </span>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: "10px",
          display: "center",
          justifyContent: "center",
        }}
        className="row"
      >
        {filteredCoins.map((coin, i) => (
          <div
            className="carddd"
            style={{
              width: "300px",
              marginTop: "30px",
              height: "300px",
              margin: "15px",
            }}
            key={i}
          >
            <Search item={coin} />
          </div>
        ))}
      </div>
      <button
        style={{ margin: "30px" }}
        onClick={() => setPage(page + 26)}
        className="btn btn-outline-dark"
        type="submit"
      >
        Load More 💱
      </button>
    </div>
  );
}

export default List;
