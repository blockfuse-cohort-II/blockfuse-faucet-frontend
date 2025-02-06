"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import FaucetComponets from "./components/FaucetComponets";
import Header from "./components/Header";

import { useReadContract, useWriteContract } from "wagmi";
import { ethers } from "ethers";
import { useChainId } from "wagmi";
import { faucetAbi, nftAbi, faucetAddress, nftAddress } from "../utils/contracts";

export default function BlockfuseFaucet() {
  const { address, isConnected } = useAccount();
  const formattedAddress = address as `0x${string}`;
  const formattedFaucetAddress = faucetAddress as `0x${string}`;
  const formattedNftAddress = nftAddress as `0x${string}`;

  const chain = useChainId();
  console.log("Current Chain ID:", chain);

  // Check if the user owns an NFT
  const { data: ownsNFT, isLoading: isCheckingOwnership, error: ownsNftError } = useReadContract({
    address: formattedNftAddress,
    abi: nftAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // Get the faucet balance
  const { data: faucetBalance, error: faucetBalanceError, isLoading: isFaucetBalanceLoading } = useReadContract({
    address: formattedFaucetAddress,
    abi: faucetAbi,
    functionName: "getBalance",
  });

  // Get the last claimed timestamp for the user
  const lastClaimedTimestamp = useReadContract({
    address: formattedFaucetAddress,
    abi: faucetAbi,
    functionName: "lastClaimedTimestamp",
    args: address ? [address] : undefined,
  });



  // Calculate if the user can claim ETH
  const canClaim =
    ownsNFT && Number(ownsNFT) > 0 && // User must own at least one NFT
    (!lastClaimedTimestamp || // If no previous claim
      (!lastClaimedTimestamp.data ||
        typeof lastClaimedTimestamp.data === "bigint" &&
        BigInt(lastClaimedTimestamp.data) + BigInt(86400) <= BigInt(Math.floor(Date.now() / 1000)))); // Cooldown period (24 hours)

  // Write contract for claiming ETH
  const { writeContract: claimETH, isPending: isClaiming, error: claimError } = useWriteContract();

  // Write contract for minting NFTs
  const { writeContract: mintNFT, isPending: isMinting, error: mintError } = useWriteContract();

  // Log relevant data for debugging
  console.log("User Address:", formattedAddress);
  console.log("User address:", address);
  console.log("Is Connected:", isConnected);
  console.log("Owns NFT:", ownsNFT, ownsNftError);
  console.log("Faucet Balance:", faucetBalance, faucetBalanceError, isFaucetBalanceLoading);
  console.log("Last Claimed Timestamp:", lastClaimedTimestamp);
  console.log("Last claimed data:", lastClaimedTimestamp.data);
  console.log("Can Claim:", canClaim);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 text-black">
      {/* Header */}

      <Header/>

   
      {/* Main Section */}
      <div className="flex w-full flex-col lg:flex-row items-center justify-center py-16">
        <FaucetComponets/>z
      </div>
    </div>
  );
}