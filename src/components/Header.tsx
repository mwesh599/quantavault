import React from 'react';
import { Shield, Activity, Wallet, TrendingUp } from 'lucide-react';
import { WalletInfo } from './WalletInfo';
import { WalletModal } from './WalletModal';
import { useWallet } from '../hooks/useWallet';

interface HeaderProps {
  oraclePrice: {
    pair: string;
    price: number;
    timestamp: Date;
    confidence: number;
  };
}

export const Header: React.FC<HeaderProps> = ({ oraclePrice }) => {
  const {
    walletState,
    isConnecting,
    transactions,
    availableWallets,
    showWalletModal,
    setShowWalletModal,
    connectWallet,
    disconnectWallet,
  } = useWallet();

  const priceChange = 2.34; // Mock price change

  return (
    <>
      <header className="bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] border-b border-indigo-800/40 sticky top-0 z-40 backdrop-blur-md">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">QuantaVault</h1>
                <p className="text-xs text-indigo-300">Secure DeFi Protocol</p>
              </div>
            </div>

            {walletState.isConnected ? (
              <WalletInfo
                walletState={walletState}
                transactions={transactions}
                onDisconnect={disconnectWallet}
              />
            ) : (
              <button
                onClick={() => setShowWalletModal(true)}
                disabled={isConnecting}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 active:from-indigo-600 active:to-purple-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all font-bold shadow-md"
              >
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">{isConnecting ? 'Connecting...' : 'Connect'}</span>
              </button>
            )}
          </div>

          {/* Price ticker */}
          <div className="mt-3 flex items-center justify-between bg-[#1a1a2e]/70 rounded-xl p-3 border border-indigo-700/40 shadow-inner backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  <span className="text-white font-bold text-xs">M</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white">
                    {oraclePrice.pair}: ${oraclePrice.price.toFixed(2)}
                  </span>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">+{priceChange}%</span>
                  </div>
                </div>
                <div className="text-xs text-indigo-300">24h Volume: $2.4M</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-400" />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        availableWallets={availableWallets}
        onConnect={connectWallet}
        isConnecting={isConnecting}
      />
    </>
  );
};
