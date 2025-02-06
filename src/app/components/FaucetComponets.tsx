import { useState } from 'react';
import { Loader2, Droplets, Shield, ExternalLink } from 'lucide-react';
const FaucetComponets = () => {
    const [hasNFT, setHasNFT] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [claimingNFT, setClaimingNFT] = useState(false);
    const [error, setError] = useState('');
  
    const handleNFTClaim = async () => {
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
                <Shield className="w-6 h-6 text-indigo-600" />
                <span className="font-medium">Access NFT Status</span>
              </div>
              {hasNFT ? (
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
            {!hasNFT ? (
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  To access the faucet, you need to claim our free NFT first
                </p>
                <button
                  onClick={handleNFTClaim}
                  disabled={claimingNFT}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                >
                  {claimingNFT ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Claiming NFT...
                    </span>
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
                  onClick={handleFaucetClaim}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Claiming...
                    </>
                  ) : (
                    <>
                      <Droplets className="w-4 h-4" />
                      Claim 0.5 Sepolia ETH
                    </>
                  )}
                </button>
              </div>
            )}
    
            {error && (
              <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm">
                {error}
              </div>
            )}
    
            
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
