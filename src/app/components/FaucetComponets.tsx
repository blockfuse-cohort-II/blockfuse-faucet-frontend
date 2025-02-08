import { useState } from 'react';
import { Loader2, Droplets, Shield, ExternalLink } from 'lucide-react';
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { faucetAbi, nftAbi, faucetAddress, nftAddress } from "../../utils/contracts";

const FaucetComponets = () => {
    /*const [hasNFT, setHasNFT] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [claimingNFT, setClaimingNFT] = useState(false);
    const [error, setError] = useState('');*/

    const { address, isConnected } = useAccount();
    const formattedAddress = address as `0x${string}`;
    const formattedFaucetAddress = faucetAddress as `0x${string}`;
    const formattedNftAddress = nftAddress as `0x${string}`;

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
  
    /*const handleNFTClaim = async () => {
      setClaimingNFT(true);
      setError('');
    
      setTimeout(() => {
        setHasNFT(true);
        setClaimingNFT(false);
      }, 2000);
    };
  
    const handleFaucetClaim = async () => {
      setIsLoading(true);
      setError('');
      
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };*/
    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-purple-500">Katera Faucet</h1>
            <p className="text-gray-600">Claim Sepolia ETH for testing</p>
          </div>
    
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-indigo-600" />
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
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                >
                  {isMinting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Claiming NFT...
                    </span>
                  ) : ownsNFT && Number(ownsNFT) > 0 ? (
                    'NFT Claimed'
                  ) : isCheckingOwnership ? (
                    'Checking Ownership...'
                  ) : (
                    'Claim Access NFT'
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    You can now claim Sepolia ETH for testing purposes
                  </p>
                </div>
                <button
                  onClick={() => {
                    claimETH({
                      address: formattedFaucetAddress,
                      abi: faucetAbi,
                      functionName: "claimETH",
                    });
                  }
                  }
                  disabled={isClaiming || !canClaim}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center gap-2"
                >
                  {isClaiming ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Claiming...
                    </>
                  ) : canClaim ? (
                    <>
                      <Droplets className="w-4 h-4" />
                      Claim 0.001 Sepolia ETH
                    </>
                  ): (
                    <>Claim 0.001 Sepolia ETH (Cooldown Active)</>
                  )}
                </button>
              </div>
            )}
    
            {(mintError && (
              <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm">
                {mintError.message}
              </div>
            )) || (claimError && (
              <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm">
                {claimError.message}
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
    }

export default FaucetComponets
