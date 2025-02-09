"use client";
import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect(); // ✅ Fetch available connectors
  const { disconnect } = useDisconnect();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleConnectClick = (connector: any) => {
    connect({ connector });
    setIsModalOpen(false); 
  };

  return (
    <div className="flex flex-col items-center">
      {isConnected ? (
        <>
          <p className="text-white">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
          <button
            onClick={() => disconnect()}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Disconnect
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => setIsModalOpen(true)} 
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            Connect Wallet
          </button>

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
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded mb-2"
                    >
                      {connector.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsModalOpen(false)} // Close modal on click
                  className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
