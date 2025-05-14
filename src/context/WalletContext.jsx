import React, { createContext, useState } from "react";
import Web3 from "web3";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [privateKey, setPrivateKey] = useState("");

    const loginWithPrivateKey = (key) => {
      const formattedKey = key.startsWith("0x") ? key : `0x${key}`;
    const provider = new Web3.providers.HttpProvider(
      "https://data-seed-prebsc-1-s1.binance.org:8545/"
    );
    const web3Instance = new Web3(provider);
    const acc = web3Instance.eth.accounts.privateKeyToAccount(formattedKey);
    web3Instance.eth.accounts.wallet.add(acc);
    web3Instance.eth.defaultAccount = acc.address;

    setWeb3(web3Instance);
    setAccount(acc);
    setPrivateKey(formattedKey);
  };

  const logout = () => {
    setWeb3(null);
    setAccount(null);
    setPrivateKey("");
  };

  return (
    <WalletContext.Provider
      value={{ web3, account, privateKey, loginWithPrivateKey, logout }}
    >
      {children}
    </WalletContext.Provider>
  );
};
