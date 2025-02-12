"use client";
import { Loader2, Droplets, Shield, ExternalLink } from "lucide-react";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import {
  faucetAbi,
  nftAbi,
  faucetAddress,
  nftAddress,
} from "../../utils/contracts";
import { useEffect, useState } from "react";

const FaucetComponets = () => {
  const { address, isConnected } = useAccount();
  const formattedAddress = address as `0x${string}`;
  const formattedFaucetAddress = faucetAddress as `0x${string}`;
  const formattedNftAddress = nftAddress as `0x${string}`;

  const [canClaim, setCanClaim] = useState(false);

  const {
    data: ownsNFT,
    isLoading: isCheckingOwnership,
  } = useReadContract({
    address: formattedNftAddress,
    abi: nftAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // const {
  //   data: faucetBalance,
  //   error: faucetBalanceError,
  //   isLoading: isFaucetBalanceLoading,
  // } = useReadContract({
  //   address: formattedFaucetAddress,
  //   abi: faucetAbi,
  //   functionName: "getBalance",
  // });

  const lastClaimedTimestamp = useReadContract({
    address: formattedFaucetAddress,
    abi: faucetAbi,
    functionName: "lastClaimedTimestamp",
    args: address ? [address] : undefined,
    query: { enabled: true },
  });

  const {
    writeContract: claimETH,
    isPending: isClaiming,
    error: claimError,
    status: claimStatus,
  } = useWriteContract();

  const {
    writeContract: mintNFT,
    isPending: isMinting,
    error: mintError,
  } = useWriteContract();

  useEffect(() => {
    if (claimStatus === "success") {
      lastClaimedTimestamp.refetch();
    }
  }, [lastClaimedTimestamp,claimStatus]);

  useEffect(() => {
    if (
      ownsNFT &&
      Number(ownsNFT) > 0 &&
      (!lastClaimedTimestamp?.data ||
        (typeof lastClaimedTimestamp.data === "bigint" &&
          BigInt(lastClaimedTimestamp.data) + BigInt(86400) <= BigInt(Math.floor(Date.now() / 1000))))
    ) {
      setCanClaim(true);
    } else {
      setCanClaim(false);
    }
  }, [ownsNFT, lastClaimedTimestamp]);

  const renderMintButton = () => {
    if (isMinting) {
      return (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Claiming NFT...
        </span>
      );
    }

    if (ownsNFT && Number(ownsNFT) > 0) {
      return "NFT Claimed";
    }

    if (isCheckingOwnership) {
      return "Checking Ownership...";
    }

    return "Claim Access NFT";
  };

  const renderClaimButton = () => {
    if (isClaiming) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Claiming...
        </>
      );
    }

    if (canClaim) {
      return (
        <>
          <Droplets className="w-4 h-4" />
          Claim 0.001 Sepolia ETH
        </>
      );
    }

    return <>Claim 0.001 Sepolia ETH (Cooldown Active)</>;
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-purple-500">Katera Faucet</h1>
        <p className="text-gray-600">Claim Sepolia ETH for testing</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-purple-600" />
            <span className="font-medium">Access NFT Status</span>
          </div>
          {ownsNFT && Number(ownsNFT) > 0 ? (
            <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
              Verified ✓
            </span>
          ) : (
            <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
              Required
            </span>
          )}
        </div>

        {/* Main Action Section */}
        {!ownsNFT ? (
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              To access the faucet, you need to claim our free NFT first
            </p>
            <button
              onClick={() => {
                mintNFT({
                  address: formattedNftAddress,
                  abi: nftAbi,
                  functionName: "mint",
                  args: [formattedAddress],
                });
              }}
              disabled={
                isMinting ||
                !isConnected ||
                (ownsNFT && Number(ownsNFT) > 0) ||
                isCheckingOwnership
              }
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-indigo-300 transition-colors"
            >
              {renderMintButton()}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-purple-500">
                You can now claim Sepolia ETH for testing purposes
              </p>
              {process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ? <p>{process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL}</p> : <>Nothing the here mr man</>}
              
            </div>
            <button
              onClick={() => {
                claimETH({
                  address: formattedFaucetAddress,
                  abi: faucetAbi,
                  functionName: "claimETH",
                });
              }}
              disabled={isClaiming || !canClaim}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-blue-300 transition-colors flex items-center justify-center gap-2"
            >
              {renderClaimButton()}
            </button>
          </div>
        )}

        {(mintError && (
          <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm">
            {mintError.message?.split('.')[0]}
          </div>
        )) ||
          (claimError && (
            <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm">
              {claimError.message?.split('.')[0]}
            </div>
          ))}

        <div className="text-sm text-gray-500 space-y-2">
          <div className="flex items-center gap-1">
            <ExternalLink className="w-4 h-4" />
            <span>View contract on Etherscan</span>
          </div>
          <p>• Limited to one claim every 24 hours</p>
          <p>• NFT must be held in your wallet during claim</p>
        </div>
      </div>
    </div>
  );
};

export default FaucetComponets;
