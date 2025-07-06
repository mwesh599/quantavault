// Updated VaultCreator.tsx with indigo/violet/blue/rose color theme
import React, { useState } from 'react';
import { Plus, AlertCircle, Shield, Loader2, X, Coins, DollarSign, TrendingUp } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

interface VaultCreatorProps {
  oraclePrice: number;
}

export const VaultCreator: React.FC<VaultCreatorProps> = ({ oraclePrice }) => {
  const [collateralAmount, setCollateralAmount] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const { walletState, sendTransaction } = useWallet();

  const collateralValue = parseFloat(collateralAmount) * oraclePrice;
  const mintValue = parseFloat(mintAmount);
  const collateralRatio = collateralValue / mintValue * 100;

  const getRatioColor = (ratio: number) => {
    if (isNaN(ratio) || ratio === Infinity) return 'text-indigo-400';
    if (ratio < 150) return 'text-rose-400';
    if (ratio < 200) return 'text-violet-400';
    return 'text-blue-400';
  };

  const canCreateVault = walletState.isConnected && 
                        collateralRatio >= 150 && 
                        !isNaN(collateralRatio) && 
                        collateralRatio !== Infinity &&
                        parseFloat(collateralAmount) <= walletState.balance;

  const handleCreateVault = async () => {
    if (!canCreateVault) return;
    
    setIsCreating(true);
    try {
      await sendTransaction('deposit', parseFloat(collateralAmount), 'MAS');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await sendTransaction('mint', parseFloat(mintAmount), 'zMASD');
      
      setIsOpen(false);
      setCollateralAmount('');
      setMintAmount('');
    } catch (error) {
      console.error('Failed to create vault:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border border-indigo-700/50 rounded-2xl p-6 backdrop-blur-sm">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex flex-col items-center justify-center space-y-3 py-8 border-2 border-dashed border-indigo-600/50 rounded-2xl hover:border-indigo-500 active:border-indigo-400 transition-all hover:bg-indigo-800/20"
        >
          <div className="p-3 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-2xl shadow-lg">
            <Plus className="h-6 w-6 text-indigo-900" />
          </div>
          <div className="text-center">
            <div className="text-indigo-100 font-bold mb-1">Create New Vault</div>
            <div className="text-indigo-300 text-sm">Deposit MAS, mint zMASD</div>
            <div className="text-indigo-400 text-xs mt-1">Earn with golden collateral</div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-indigo-900 to-violet-900 border border-indigo-700/50 rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto backdrop-blur-sm">
        <div className="flex items-center justify-between p-6 border-b border-indigo-700/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-xl shadow-lg">
              <Shield className="h-5 w-5 text-indigo-900" />
            </div>
            <h3 className="text-lg font-bold text-indigo-100">Create Vault</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-indigo-300 hover:text-indigo-100 transition-colors rounded-xl hover:bg-indigo-800/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {!walletState.isConnected && (
            <div className="mb-6 p-4 bg-violet-500/20 border border-violet-500/30 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center space-x-2 text-violet-300">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Connect your wallet to create a vault</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center space-x-2 text-sm font-bold text-indigo-100">
                  <Coins className="h-4 w-4 text-indigo-400" />
                  <span>Collateral Amount</span>
                </label>
                <span className="text-xs text-indigo-300">
                  Balance: {walletState.balance.toFixed(2)} MAS
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={collateralAmount}
                  onChange={(e) => setCollateralAmount(e.target.value)}
                  className="w-full bg-indigo-800/30 border border-indigo-700/50 rounded-2xl px-4 py-4 text-indigo-100 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm placeholder-indigo-400"
                  placeholder="0.00"
                  disabled={!walletState.isConnected}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <button
                    onClick={() => setCollateralAmount(walletState.balance.toString())}
                    className="text-xs text-indigo-900 hover:text-indigo-800 font-bold bg-gradient-to-r from-violet-400 to-indigo-400 px-2 py-1 rounded-lg shadow-sm"
                    disabled={!walletState.isConnected}
                  >
                    MAX
                  </button>
                  <span className="text-indigo-300 text-sm font-bold">MAS</span>
                </div>
              </div>
              <p className="text-xs text-indigo-400 mt-2 flex items-center space-x-1">
                <TrendingUp className="h-3 w-3" />
                <span>≈ ${collateralValue.toFixed(2)} at current price</span>
              </p>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-bold text-indigo-100 mb-3">
                <DollarSign className="h-4 w-4 text-blue-400" />
                <span>Mint Amount</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  className="w-full bg-indigo-800/30 border border-indigo-700/50 rounded-2xl px-4 py-4 text-indigo-100 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm placeholder-indigo-400"
                  placeholder="0.00"
                  disabled={!walletState.isConnected}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <span className="text-blue-400 text-sm font-bold">zMASD</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-800/20 rounded-2xl p-4 border border-indigo-700/30 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-indigo-200">Health Ratio</span>
                <span className={`text-lg font-bold ${getRatioColor(collateralRatio)}`}>
                  {isNaN(collateralRatio) || collateralRatio === Infinity ? '—' : `${collateralRatio.toFixed(1)}%`}
                </span>
              </div>
              {!isNaN(collateralRatio) && collateralRatio !== Infinity && (
                <div className="w-full bg-indigo-900/50 rounded-full h-3 mb-3">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      collateralRatio < 150 ? 'bg-gradient-to-r from-rose-500 to-rose-400' : 
                      collateralRatio < 200 ? 'bg-gradient-to-r from-violet-500 to-indigo-400' : 'bg-gradient-to-r from-blue-500 to-blue-400'
                    }`}
                    style={{ width: `${Math.min(collateralRatio / 3, 100)}%` }}
                  ></div>
                </div>
              )}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-indigo-300">Liquidation Price</span>
                  <span className="text-indigo-100 font-medium">
                    ${mintValue && collateralAmount ? (mintValue * 1.5 / parseFloat(collateralAmount)).toFixed(2) : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-300">Stability Fee</span>
                  <span className="text-indigo-100 font-medium">2.5% APR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-300">Minimum Ratio</span>
                  <span className="text-indigo-100 font-medium">150%</span>
                </div>
              </div>
            </div>

            {parseFloat(collateralAmount) > walletState.balance && walletState.isConnected && (
              <div className="flex items-center space-x-2 text-rose-300 text-sm bg-rose-500/20 p-3 rounded-2xl border border-rose-500/30">
                <AlertCircle className="h-4 w-4" />
                <span>Insufficient balance</span>
              </div>
            )}

            {collateralRatio < 150 && !isNaN(collateralRatio) && collateralRatio !== Infinity && (
              <div className="flex items-center space-x-2 text-rose-300 text-sm bg-rose-500/20 p-3 rounded-2xl border border-rose-500/30">
                <AlertCircle className="h-4 w-4" />
                <span>Health ratio must be at least 150%</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-indigo-800/50 hover:bg-indigo-700/50 active:bg-indigo-600/50 text-indigo-200 py-4 px-6 rounded-2xl font-bold transition-all border border-indigo-700/50"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateVault}
                disabled={!canCreateVault || isCreating}
                className={`py-4 px-6 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 shadow-lg ${
                  canCreateVault && !isCreating
                    ? 'bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 active:from-violet-600 active:to-indigo-600 text-indigo-900'
                    : 'bg-indigo-800/50 text-indigo-400 cursor-not-allowed border border-indigo-700/50'
                }`}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Vault</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
