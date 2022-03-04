import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useList } from "../context/ListContext";
import Search from "./Search";

function List() {
  const { items, usd, setUSD } = useList();
  const [list, setList] = useState([]);
  const [filterText, setFilterText] = useState("");

  localStorage.setItem("usd", JSON.stringify(usd));

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
  }, [items]);

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
              <li className="nav-item"></li>

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
              <button s className="btn btn-outline-primary" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div style={{ marginTop: "15px" }}>
        <button
          style={{ border: "solid 1px black" }}
          className="btn btn-warning"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasRight"
          aria-controls="offcanvasRight"
        >
          Wallet <span className="badge bg-dark">{items.length}</span>
        </button>

        <button
          style={{ marginLeft: "5px", border: "solid 1px black" }}
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
          style={{ marginLeft: "5px", border: "solid 1px black" }}
          type="button"
          class="btn btn-secondary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          data-bs-whatever="@mdo"
        >
          ⚙️
        </button>
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
                  New message
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Recipient:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message-text" className="col-form-label">
                      Message:
                    </label>
                    <textarea
                      className="form-control"
                      id="message-text"
                      defaultValue={""}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Send message
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="collapse" id="collapseExample">
          <div className="card card-body">
            Some placeholder content for the collapse component. This panel is
            hidden by default but revealed when the user activates the relevant
            trigger.
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
                {JSON.parse(localStorage.getItem("usd")).toFixed(0)}$
              </button>
            </span>
            {}
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: "20px",
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
