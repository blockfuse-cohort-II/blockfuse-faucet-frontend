import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import Logo from "@/assets/logo2.png";
import Image from "next/image";
const Header = () => {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const formattedAddress = address as `0x${string}`;

  return (
    <header className="w-full flex justify-between items-center p-6 bg-white border-b-4 border-purple-300 pink-shadow">
      <div className="flex items-center gap-2">
        <Image
          src={Logo}
          width={500}
          height={500}
          alt="faucet wallet"
          className="w-10 h-10"
        />
        <p className="text-lg font-bold">Katera Faucet</p>
      </div>
      {isConnected ? (
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Disconnect ({formattedAddress.slice(0, 6)}...
          {formattedAddress.slice(-4)})
        </button>
      ) : (
        <button
          onClick={() => connect({ connector: connectors?.[0] || injected() })}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Connect Wallet
        </button>
      )}
    </header>
  );
};

export default Header;
