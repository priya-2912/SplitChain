import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  WalletService,
  EthersSplitChainRepository,
} from "../../services/contract";
import type { Address, SplitChainRepository } from "../../types/domain";
import { TARGET_CHAIN_ID } from "../../config/networks";

type WalletContextValue = {
  address: Address | null;
  chainId: number | null;
  connecting: boolean;
  error: string | null;
  repository: SplitChainRepository | null;
  connect: () => Promise<void>;
  switchNetwork: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Context = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet] = useState(() => new WalletService());
  const [address, setAddress] = useState<Address | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  const refresh = useCallback(async () => {
    if (!wallet.provider) return;
    try {
      const id = await wallet.getNetworkId();
      setChainId(id);
      if (wallet.signer) setAddress(wallet.address);
    } catch {
      setAddress(null);
      setChainId(null);
    }
  }, [wallet]);

  const connect = async () => {
    setConnecting(true);
    setError(null);
    try {
      const result = await wallet.connect();
      setAddress(result.address);
      setChainId(result.chainId);
      setRevision((v) => v + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Wallet connection failed.");
    } finally {
      setConnecting(false);
    }
  };

  const switchNetwork = async () => {
    setError(null);
    try {
      await wallet.switchNetwork(TARGET_CHAIN_ID);
      await refresh();
      setRevision((v) => v + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network switch failed.");
    }
  };

  useEffect(() => {
    const eth = window.ethereum;
    if (!eth?.on) return;
    const account = (v: unknown) => {
      const list = v as string[];
      const selected = list?.[0] || null;
      void wallet
        .updateAccount(selected)
        .then(() => {
          setAddress(selected as Address | null);
          setRevision((x) => x + 1);
        })
        .catch(() => {
          setAddress(null);
          setRevision((x) => x + 1);
        });
    };
    const chain = () => {
      void refresh();
      setRevision((x) => x + 1);
    };
    eth.on("accountsChanged", account);
    eth.on("chainChanged", chain);
    return () => {
      eth.removeListener?.("accountsChanged", account);
      eth.removeListener?.("chainChanged", chain);
    };
  }, [wallet, refresh]);

  // Include revision to recreate repo on external wallet account or chain switches
  const repository = useMemo(
    () =>
      address && chainId === TARGET_CHAIN_ID
        ? new EthersSplitChainRepository(wallet)
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, chainId, revision, wallet],
  );

  return (
    <Context.Provider
      value={{
        address,
        chainId,
        connecting,
        error,
        repository,
        connect,
        switchNetwork,
        refresh,
      }}
    >
      {children}
    </Context.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWallet() {
  const value = useContext(Context);
  if (!value) throw new Error("useWallet must be used within WalletProvider");
  return value;
}
