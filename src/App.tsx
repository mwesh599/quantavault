import React from 'react';
import { Header } from './components/Header';
import { ProtocolStats } from './components/ProtocolStats';
import { VaultCard } from './components/VaultCard';
import { VaultCreator } from './components/VaultCreator';
import { LiquidationQueue } from './components/LiquidationQueue';
import { KeeperDashboard } from './components/KeeperDashboard';
import { useProtocolData } from './hooks/useProtocolData';
import { useWallet } from './hooks/useWallet';
import { Shield, Coins, TrendingUp } from 'lucide-react';

function App() {
  const { vaults, oraclePrice, liquidationEvents, keeperStats, protocolStats } = useProtocolData();
  const { walletState } = useWallet();

  const userVaults = walletState.isConnected
    ? vaults.filter(vault => vault.owner === walletState.address)
    : [];
  const otherVaults = walletState.isConnected
    ? vaults.filter(vault => vault.owner !== walletState.address)
    : vaults;

  const formattedTVL = (protocolStats.totalCollateral * oraclePrice.price / 1_000_000).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-blue-900 text-white relative">
      {/* Patterned Background */}
      <div className="fixed inset-0 opacity-10 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,197,253,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(96,165,250,0.05)_50%,transparent_75%)]" />
      </div>

      <Header oraclePrice={oraclePrice} />

      <main className="relative px-4 py-6 pb-24 z-10">
        {/* Hero / Intro */}
        <section className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Shield className="h-6 w-6 text-blue-950" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-blue-100">QuantaVault</h2>
              <p className="text-sm text-blue-200">
                Autonomous, decentralized golden vaults powered by Massa Blockchain
              </p>
            </div>
          </div>

          {/* Live Stats Banner */}
          <div className="bg-blue-800/40 border border-blue-700/60 rounded-2xl p-4 flex flex-wrap justify-between items-center gap-4 backdrop-blur-md shadow-inner">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-blue-200 text-sm font-medium">Live Protocol</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-blue-300" />
                <span className="text-blue-100 font-semibold text-sm">${formattedTVL}M TVL</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-400 font-semibold">
              <TrendingUp className="w-4 h-4" />
              +24.5%
            </div>
          </div>
        </section>

        {/* Protocol Stats */}
        <ProtocolStats stats={protocolStats} oraclePrice={oraclePrice.price} />

        {/* Vaults Section */}
        <section className="mt-10 space-y-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-semibold text-blue-100">
              {walletState.isConnected ? 'Your Golden Vaults' : 'Golden Vaults'}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-blue-300 font-medium">Live</span>
            </div>
          </div>

          <VaultCreator oraclePrice={oraclePrice.price} />

          {userVaults.map((vault) => (
            <VaultCard key={vault.id} vault={vault} oraclePrice={oraclePrice.price} />
          ))}

          {walletState.isConnected && userVaults.length === 0 && (
            <div className="mt-6 text-center py-10 bg-blue-800/30 rounded-2xl border border-blue-700/50 backdrop-blur-md">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="h-8 w-8 text-blue-950" />
              </div>
              <p className="text-blue-100 font-semibold mb-1">No golden vaults yet</p>
              <p className="text-sm text-blue-300">Create your first vault to start earning with zMASD.</p>
            </div>
          )}

          {otherVaults.slice(0, walletState.isConnected ? 3 : 5).map((vault) => (
            <VaultCard key={vault.id} vault={vault} oraclePrice={oraclePrice.price} />
          ))}
        </section>

        {/* Side Panels */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <LiquidationQueue events={liquidationEvents} />
          <KeeperDashboard stats={keeperStats} />
        </section>

        {/* All Vaults List */}
        <section className="mt-10 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-700/50 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="p-4 border-b border-blue-700/40">
            <h3 className="text-lg font-bold text-blue-100">All Golden Vaults</h3>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-full divide-y divide-blue-700/30">
              {vaults.map((vault) => (
                <div key={vault.id} className="p-4 hover:bg-blue-900/20 transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-blue-100">#{vault.id.split('-')[1]}</span>
                      {walletState.isConnected && vault.owner === walletState.address && (
                        <span className="text-xs bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/40">
                          You
                        </span>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-full border ${
                        vault.isLiquidatable
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : 'bg-green-500/20 text-green-300 border-green-500/30'
                      }`}
                    >
                      {vault.isLiquidatable ? 'At Risk' : 'Healthy'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="bg-blue-800/20 rounded-xl p-2 border border-blue-700/30">
                      <span className="text-blue-300 text-xs">Collateral</span>
                      <p className="text-blue-100 font-bold">{vault.collateralAmount.toFixed(2)} MAS</p>
                    </div>
                    <div className="bg-blue-800/20 rounded-xl p-2 border border-blue-700/30">
                      <span className="text-blue-300 text-xs">Debt</span>
                      <p className="text-blue-100 font-bold">{vault.debtAmount.toFixed(2)} zMASD</p>
                    </div>
                    <div className="bg-blue-800/20 rounded-xl p-2 border border-blue-700/30">
                      <span className="text-blue-300 text-xs">C-Ratio</span>
                      <p
                        className={`font-bold ${
                          vault.collateralRatio < 150
                            ? 'text-red-400'
                            : vault.collateralRatio < 200
                            ? 'text-yellow-400'
                            : 'text-green-400'
                        }`}
                      >
                        {vault.collateralRatio.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
