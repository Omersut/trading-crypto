import { useState, createContext, useContext, useEffect } from "react";

const ListContext = createContext();

const ListProvider = ({ children }) => {
  const defaultWalletAmount = JSON.parse(localStorage.getItem("wallet"));
  const [wallet, setWallet] = useState(defaultWalletAmount || []);
  const defaultWallet = JSON.parse(localStorage.getItem("items"));
  const [items, setItems] = useState(defaultWallet || []);

  const [usd, setUSD] = useState(
    JSON.parse(localStorage.getItem("usd"))
      ? JSON.parse(localStorage.getItem("usd"))
      : 100000
  );

  const addToList = (item) => {
    const walletCurrent = wallet.filter((a) => a.id !== item.id);
    const checkWallet = wallet.find((a) => a.id === item.id);
    if (checkWallet) {
      checkWallet.amount += 1;
      setWallet([...walletCurrent, checkWallet]);
    } else {
      setItems((items) => [item, ...items]);
      setWallet([
        ...wallet,
        {
          id: item.id,
          amount: 1,
        },
      ]);
    }
  };
  const removeFromList = (item) => {
    const checkWallet = wallet.find((a) => a.id === item.id);
    const walletCurrent = wallet.filter((a) => a.id !== item.id);
    checkWallet.amount -= 1;

    if (checkWallet.amount === 0) {
      const filtered = items.filter((a) => a.id !== item.id);
      setItems(filtered);
      setWallet([...walletCurrent]);
    } else {
      setWallet([...walletCurrent, checkWallet]);
    }
  };

  const values = {
    wallet,
    setWallet,
    addToList,
    removeFromList,
    usd,
    setUSD,
    items,
    setItems,
  };

  return <ListContext.Provider value={values}>{children}</ListContext.Provider>;
};

const useList = () => useContext(ListContext);
export { ListProvider, useList };
