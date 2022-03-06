import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useList } from "../context/ListContext";
import Search from "./Search";

function List() {
  const { wallet, usd, setUSD, items } = useList();
  const [list, setList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [total, setTotal] = useState(
    JSON.parse(localStorage.getItem("total")) || 100000
  );

  const data = () => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
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
    setTotal(usd + t);
    localStorage.setItem("usd", JSON.stringify(usd));
    localStorage.setItem("total", JSON.stringify(total));
    localStorage.setItem("t", JSON.stringify(t));
    localStorage.setItem("wallet", JSON.stringify(wallet));
    localStorage.setItem("items", JSON.stringify(items));
  }, [wallet]);

  const filteredCoins = list.filter((item) =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-black position-sticky fixed-top">
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

              <li className="nav-item"></li>
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

      <div style={{ marginTop: "10px" }}>
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
                      className="btn btn-outline-dark"
                      type="submit"
                    >
                      Dark
                    </button>
                    <button
                      style={{ margin: "5px" }}
                      className="btn btn-dark"
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
            <h3>{localStorage.getItem("username")}</h3>
            <span>
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
                TOTAL: {total}$
              </button>
              <button
                style={{ margin: "5px" }}
                type="button"
                className="btn btn-outline-dark"
              >
                {usd} USD
              </button>
            </span>
            <div style={{ marginLeft: "43px" }}>
              {items.map((item, i) => (
                <span key={i}>
                  <Search item={item} />
                </span>
              ))}
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
            style={{
              width: "250px",
              margin: "7px",
              height: "250px",
            }}
            key={i}
          >
            <Search item={coin} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default List;
