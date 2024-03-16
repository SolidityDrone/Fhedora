import { BrowserProvider } from "ethers";
import { useState, useCallback, useEffect, useMemo, React } from "react";

const AUTHORIZED_CHAIN_ID = ["0xA455"]; // 42069

export const Connect = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [validNetwork, setValidNetwork] = useState(false);
  const [account, setAccount] = useState("");
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);

  const refreshAccounts = (accounts) => {
    setAccount(accounts[0] || "");
    setConnected(accounts.length > 0);
  };

  const hasValidNetwork = async () => {
    const currentChainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    setValidNetwork(AUTHORIZED_CHAIN_ID.includes(currentChainId.toLowerCase()));
    return validNetwork;
  };

  const refreshNetwork = useCallback(async () => {
    await hasValidNetwork();
  }, []);

  const refreshProvider = (eth) => {
    const p = new BrowserProvider(eth);
    setProvider(p);
    return p;
  };

  useEffect(() => {
    const eth = window.ethereum;
    if (!eth) {
      setError("No wallet has been found");
      return;
    }

    const p = refreshProvider(eth);

    p.send("eth_accounts", [])
      .then(async (accounts) => {
        refreshAccounts(accounts);
        await refreshNetwork();
      })
      .catch(() => {
        // Do nothing
      });
    eth.on("accountsChanged", refreshAccounts);
    eth.on("chainChanged", refreshNetwork);
  }, [refreshNetwork]);

  const connect = async () => {
    if (!provider) {
      return;
    }
    const accounts = await provider.send("eth_requestAccounts", []);

    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setConnected(true);
      if (!(await hasValidNetwork())) {
        await switchNetwork();
      }
    }
  };

  const switchNetwork = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: AUTHORIZED_CHAIN_ID[0] }],
      });
    } catch (e) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: AUTHORIZED_CHAIN_ID[0],
            rpcUrls: ["https://api.testnet.fhenix.zone:7747"],
            chainName: "Fhenix",
            nativeCurrency: {
              name: "FHE",
              symbol: "FHE",
              decimals: 18,
            },
            blockExplorerUrls: [""],
          },
        ],
      });
    }
    await refreshNetwork();
  }, [refreshNetwork]);

  const connectInfos = useMemo(() => {
    if (error) {
      return <p>No wallet has been found.</p>;
    }

    if (connected) {
      return <div className="Connect__account">{shortenAddress(account)}</div>;
    }

    if (validNetwork) {
      return null;
    }

    return (
      <div>
        <p>
          <button className="Connect__button" onClick={switchNetwork}>
            Switch to Fhenix
          </button>
        </p>
      </div>
    );
  }, [connected, validNetwork, account, error, switchNetwork]);

  // Function to shorten the address
  function shortenAddress(address) {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  return (
    <>
      {connectInfos}
      <div className="Connect__child">{children}</div>
    </>
  );
};