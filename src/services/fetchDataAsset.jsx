import { CONTRACT_ABI } from "@/blockchain/contractABI";
import { CONTRACT_ADDRESS } from "@/blockchain/contractAddress";
import { WalletContext } from "@/context/WalletContext";
import { initData } from "@/redux/features/asset/assetSlice";
import Web3 from "web3";

export const loginWithPrivateKey = (key) => {
  try {
    const formattedKey = key.startsWith("0x") ? key : `0x${key}`;
    const provider = new Web3.providers.HttpProvider(
      "https://data-seed-prebsc-1-s1.binance.org:8545/"
    );
    const web3Instance = new Web3(provider);
    const acc = web3Instance.eth.accounts.privateKeyToAccount(formattedKey);
    web3Instance.eth.accounts.wallet.add(acc);
    web3Instance.eth.defaultAccount = acc.address;

    return {
      web3: web3Instance,
      account: acc,
      privateKey: formattedKey,
    };
  } catch (error) {
    console.error("Error in loginWithPrivateKey:", error);
    throw error; // Re-throw to handle in calling function
  }
};
