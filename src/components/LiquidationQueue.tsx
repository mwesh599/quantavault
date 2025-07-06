import React from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Coins,
  DollarSign,
} from 'lucide-react';
import { LiquidationEvent } from '../types';

interface LiquidationQueueProps {
  events: LiquidationEvent[];
}

export const LiquidationQueue: React.FC<LiquidationQueueProps> = ({ events }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-300 bg-yellow-500/10 border-yellow-500/20';
      case 'completed':
        return 'text-green-300 bg-green-500/10 border-green-500/20';
      case 'failed':
        return 'text-red-300 bg-red-500/10 border-red-500/20';
      default:
        return 'text-orange-300 bg-orange-500/10 border-orange-500/20';
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1c2c] via-[#161827] to-[#0e0f1a] border border-indigo-800/30 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="p-4 border-b border-indigo-700/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl shadow-md">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Liquidation Queue</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-indigo-300 font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="p-4">
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[#1e2135]/70 rounded-2xl p-4 border border-indigo-700/30 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#2b2f4a]/50 rounded-xl border border-indigo-600/30">
                    {getStatusIcon(event.status)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      Vault #{event.vaultId.split('-')[1]}
                    </p>
                    <p className="text-xs text-indigo-300">
                      {event.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-bold capitalize border ${getStatusColor(
                    event.status
                  )}`}
                >
                  {event.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#262a45]/60 rounded-xl p-2 border border-indigo-700/30">
                  <div className="flex items-center space-x-1 mb-1">
                    <Coins className="h-3 w-3 text-yellow-400" />
                    <span className="text-indigo-300">Collateral</span>
                  </div>
                  <p className="text-white font-bold">
                    {event.collateralLiquidated.toFixed(2)} MAS
                  </p>
                </div>
                <div className="bg-[#262a45]/60 rounded-xl p-2 border border-indigo-700/30">
                  <div className="flex items-center space-x-1 mb-1">
                    <DollarSign className="h-3 w-3 text-green-400" />
                    <span className="text-indigo-300">Debt Repaid</span>
                  </div>
                  <p className="text-white font-bold">
                    {event.debtRepaid.toFixed(2)} zMASD
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-indigo-800/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-indigo-300">Auto-liquidation</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 font-bold">Decentralized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
