import React from 'react';
import { X, ExternalLink, Download, Loader2, Shield } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableWallets: Array<{
    id: string;
    name: string;
    icon: string;
    installed: boolean;
    downloadUrl?: string;
  }>;
  onConnect: (walletId: string) => void;
  isConnecting: boolean;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  availableWallets,
  onConnect,
  isConnecting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      {/* Modal Content with custom background */}
      <div className="relative w-full max-w-md bg-custom-pattern bg-cover bg-center border border-amber-700/50 rounded-t-3xl sm:rounded-3xl shadow-xl overflow-hidden animate-fade-in">

        {/* Overlay to darken background for readability */}
        <div className="absolute inset-0 bg-black/50 z-0" />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-amber-700/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl shadow-md">
                <Shield className="h-5 w-5 text-amber-900" />
              </div>
              <h2 className="text-xl font-bold text-amber-100">Connect Wallet</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-amber-300 hover:text-amber-100 rounded-xl hover:bg-amber-800/30 transition-colors"
              aria-label="Close wallet modal"
              disabled={isConnecting}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Wallet Options */}
          <div className="p-6 space-y-4">
            {availableWallets.map((wallet) => (
              <div key={wallet.id} className="relative group">
                <button
                  onClick={() => wallet.installed && onConnect(wallet.id)}
                  disabled={!wallet.installed || isConnecting}
                  aria-disabled={!wallet.installed}
                  aria-label={`Connect to ${wallet.name}`}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                    wallet.installed
                      ? 'border-amber-600/50 hover:border-amber-500 hover:bg-amber-800/30 active:bg-amber-700/30 cursor-pointer'
                      : 'border-amber-700/30 bg-amber-800/20 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{wallet.icon}</div>
                    <div>
                      <p className="text-amber-100 font-bold">{wallet.name}</p>
                      <p className="text-xs text-amber-300">
                        {wallet.installed ? 'Ready to connect' : 'Not installed'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {isConnecting ? (
                      <Loader2 className="h-5 w-5 text-amber-400 animate-spin" />
                    ) : wallet.installed ? (
                      <div className="w-3 h-3 bg-green-400 rounded-full shadow-md" />
                    ) : wallet.downloadUrl ? (
                      <a
                        href={wallet.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-amber-400 hover:text-amber-300"
                        onClick={(e) => e.stopPropagation()}
                        title={`Download ${wallet.name}`}
                      >
                        <Download className="h-4 w-4" />
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <div className="flex items-center space-x-1 text-amber-400">
                        <Download className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </button>
              </div>
            ))}

            {/* Info Section */}
            <div className="mt-6 p-4 bg-amber-800/20 rounded-2xl border border-amber-700/30">
              <p className="text-sm text-amber-200 mb-2 font-bold">New to Massa?</p>
              <p className="text-xs text-amber-300 leading-relaxed">
                Download a wallet to get started with decentralized finance on the Massa blockchain.
                Your keys, your crypto, your golden future.
              </p>
            </div>

            {/* Terms & Policy */}
            <div className="text-center mt-4">
              <p className="text-xs text-amber-400 leading-relaxed">
                By connecting a wallet, you agree to our{' '}
                <span className="text-amber-300 font-medium underline underline-offset-2 cursor-pointer">Terms of Service</span> and{' '}
                <span className="text-amber-300 font-medium underline underline-offset-2 cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
