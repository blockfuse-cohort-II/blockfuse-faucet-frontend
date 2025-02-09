"use client";
import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import Logo from "@/assets/logo2.png";
import Image from "next/image";

const Header = () => {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [clientConnected, setClientConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setClientConnected(isConnected); 
  }, [isConnected]);

  const formattedAddress = address as `0x${string}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleConnectClick = (connector: any) => {
    connect({ connector });
    setIsModalOpen(false); // Close modal after connecting
  };

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
      {clientConnected ? (
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Disconnect ({formattedAddress?.slice(0, 6)}...
          {formattedAddress?.slice(-4)})
        </button>
      ) : (
        <button
          onClick={() => setIsModalOpen(true)} 
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Connect Wallet
        </button>
      )}

      {/* Modal for wallet connectors */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 w-80">
            <h2 className="text-lg font-semibold mb-4">Select a Wallet</h2>
            <div className="space-y-2">
              {connectors.map((connector, index) => (
                <button
                  key={index + connector.name}
                  onClick={() => handleConnectClick(connector)}
                  className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded mb-2"
                >
                  {connector.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsModalOpen(false)} 
              className="mt-4 w-full px-4 py-2 bg-gray-500 hover:bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
