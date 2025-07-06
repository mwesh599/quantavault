// Updated WalletInfo.tsx with indigo/violet/blue/rose theme
import React, { useState } from 'react';
import {
  Copy,
  ExternalLink,
  LogOut,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  Coins,
  DollarSign,
} from 'lucide-react';
import { WalletState, Transaction } from '../types';

interface WalletInfoProps {
  walletState: WalletState;
  transactions: Transaction[];
  onDisconnect: () => void;
}

export const WalletInfo: React.FC<WalletInfoProps> = ({
  walletState,
  transactions,
  onDisconnect,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const copyAddress = () => {
    if (walletState.address) {
      navigator.clipboard.writeText(walletState.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const formatAddress = (address: string) => `${address.slice(0, 4)}...${address.slice(-4)}`;

  const getTransactionIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3 text-violet-400" />;
      case 'confirmed':
        return <CheckCircle className="h-3 w-3 text-blue-400" />;
      case 'failed':
        return <XCircle className="h-3 w-3 text-rose-400" />;
    }
  };

  const getTransactionColor = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return 'text-violet-400';
      case 'confirmed':
        return 'text-blue-400';
      case 'failed':
        return 'text-rose-400';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-indigo-800/30 border border-indigo-700/50 rounded-xl px-3 py-2 hover:bg-indigo-700/30 active:bg-indigo-600/30 transition-all backdrop-blur-sm"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-indigo-900 text-xs font-bold">
            {walletState.address?.slice(2, 4).toUpperCase()}
          </span>
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-indigo-100 text-sm font-bold">
            {walletState.address ? formatAddress(walletState.address) : ''}
          </p>
          <p className="text-indigo-300 text-xs">{walletState.balance.toFixed(2)} MAS</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-indigo-300 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
          <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-indigo-900 to-violet-900 border border-indigo-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-sm">
            {/* Header */}
            <div className="p-4 border-b border-indigo-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-indigo-900 font-bold text-sm">
                      {walletState.address?.slice(2, 4).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-indigo-100 font-bold">{walletState.provider}</p>
                    <p className="text-indigo-300 text-sm">{walletState.network}</p>
                  </div>
                </div>
                <button
                  onClick={onDisconnect}
                  className="p-2 text-indigo-300 hover:text-rose-400 transition-colors rounded-xl hover:bg-rose-500/20"
                  title="Disconnect"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>

              {/* Balance Card */}
              <div className="bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-2xl p-4 mb-4 border border-indigo-600/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Coins className="h-4 w-4 text-indigo-400" />
                    <span className="text-indigo-200 text-sm">Total Balance</span>
                  </div>
                  <span className="text-indigo-100 font-bold text-lg">
                    {walletState.balance.toFixed(4)} MAS
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-3 w-3 text-blue-400" />
                    <span className="text-indigo-300 text-xs">≈ USD Value</span>
                  </div>
                  <span className="text-blue-400 text-sm font-medium">
                    ${(walletState.balance * 45.23).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={copyAddress}
                  className="flex items-center justify-center space-x-2 text-indigo-900 hover:text-indigo-800 bg-gradient-to-r from-violet-400/80 to-indigo-400/80 hover:from-violet-400 hover:to-indigo-400 py-2 px-3 rounded-xl transition-all font-bold shadow-sm"
                >
                  <Copy className="h-3 w-3" />
                  <span className="text-xs">
                    {copiedAddress ? 'Copied!' : 'Copy'}
                  </span>
                </button>
                <button className="flex items-center justify-center space-x-2 text-indigo-900 hover:text-indigo-800 bg-gradient-to-r from-violet-400/80 to-indigo-400/80 hover:from-violet-400 hover:to-indigo-400 py-2 px-3 rounded-xl transition-all font-bold shadow-sm">
                  <ExternalLink className="h-3 w-3" />
                  <span className="text-xs">Explorer</span>
                </button>
              </div>
            </div>

            {/* Transactions */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-indigo-100 font-bold text-sm">Recent Activity</h4>
                <Activity className="h-4 w-4 text-indigo-400" />
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 bg-indigo-800/20 rounded-xl border border-indigo-700/30"
                  >
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(tx.status)}
                      <div>
                        <p className="text-indigo-100 text-sm font-bold capitalize">{tx.type}</p>
                        <p className="text-indigo-300 text-xs">
                          {tx.amount.toFixed(2)} {tx.asset}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold capitalize ${getTransactionColor(tx.status)}`}>
                        {tx.status}
                      </p>
                      <p className="text-indigo-400 text-xs">
                        {tx.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {transactions.length === 0 && (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-indigo-800/30 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-indigo-700/50">
                    <Activity className="h-5 w-5 text-indigo-400" />
                  </div>
                  <p className="text-indigo-300 text-sm">No transactions yet</p>
                  <p className="text-indigo-400 text-xs">Your activity will appear here</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
