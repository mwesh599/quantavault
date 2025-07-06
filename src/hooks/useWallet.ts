import { useState, useEffect, useCallback } from 'react';
import { WalletState, Transaction } from '../types';

// Enhanced wallet providers for Massa ecosystem
const WALLET_PROVIDERS = {
  MASSA_STATION: 'Massa Station',
  MASSA_WALLET: 'Massa Wallet',
  METAMASK: 'MetaMask (Massa)',
  WALLET_CONNECT: 'WalletConnect',
};

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: 0,
    network: 'Massa Mainnet',
    provider: null,
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Enhanced available wallets with better mockups
  const [availableWallets, setAvailableWallets] = useState([
    { id: 'massa-station', name: 'Massa Station', icon: '🏛️', installed: true },
    { id: 'massa-wallet', name: 'Massa Wallet', icon: '💰', installed: true },
    { id: 'metamask', name: 'MetaMask', icon: '🦊', installed: false },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', installed: true },
  ]);

  const connectWallet = useCallback(async (walletId: string) => {
    setIsConnecting(true);
    
    try {
      // Simulate realistic connection time
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate realistic Massa address
      const mockAddress = `AS1${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const mockBalance = Math.random() * 5000 + 2000; // 2000-7000 MAS
      
      setWalletState({
        isConnected: true,
        address: mockAddress,
        balance: mockBalance,
        network: 'Massa Mainnet',
        provider: availableWallets.find(w => w.id === walletId)?.name || null,
      });
      
      setShowWalletModal(false);
      
      // Generate realistic transaction history
      const mockTransactions: Transaction[] = [];
      const transactionTypes: Array<Transaction['type']> = ['deposit', 'withdraw', 'mint', 'repay', 'liquidate'];
      const assets = ['MAS', 'zMASD'];
      
      for (let i = 0; i < 12; i++) {
        const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
        const asset = type === 'deposit' || type === 'withdraw' ? 'MAS' : 
                     type === 'mint' || type === 'repay' ? 'zMASD' : 
                     assets[Math.floor(Math.random() * assets.length)];
        
        mockTransactions.push({
          id: `tx-${i}-${Date.now()}`,
          type,
          amount: Math.random() * 1000 + 50,
          asset,
          status: i < 2 ? 'pending' : Math.random() > 0.05 ? 'confirmed' : 'failed',
          hash: `0x${Math.random().toString(16).substring(2, 66)}`,
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 14), // Last 14 days
          gasUsed: Math.floor(Math.random() * 150000) + 21000,
        });
      }
      
      // Sort by timestamp (newest first)
      mockTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setTransactions(mockTransactions);
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [availableWallets]);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      balance: 0,
      network: 'Massa Mainnet',
      provider: null,
    });
    setTransactions([]);
    localStorage.removeItem('massa-wallet-connected');
  }, []);

  const sendTransaction = useCallback(async (type: Transaction['type'], amount: number, asset: string) => {
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      amount,
      asset,
      status: 'pending',
      hash: `0x${Math.random().toString(16).substring(2, 66)}`,
      timestamp: new Date(),
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Simulate realistic transaction processing
    const processingTime = Math.random() * 4000 + 2000; // 2-6 seconds
    
    setTimeout(() => {
      const success = Math.random() > 0.05; // 95% success rate
      
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === newTransaction.id 
            ? { 
                ...tx, 
                status: success ? 'confirmed' : 'failed', 
                gasUsed: Math.floor(Math.random() * 150000) + 21000 
              }
            : tx
        )
      );

      // Update balance if transaction succeeded
      if (success) {
        setWalletState(prev => {
          let balanceChange = 0;
          
          switch (type) {
            case 'deposit':
              balanceChange = -amount;
              break;
            case 'withdraw':
              balanceChange = amount;
              break;
            case 'mint':
              // Minting doesn't directly affect MAS balance
              break;
            case 'repay':
              // Repaying might affect balance indirectly
              break;
            case 'liquidate':
              balanceChange = amount * 0.05; // 5% liquidation bonus
              break;
          }
          
          return {
            ...prev,
            balance: Math.max(0, prev.balance + balanceChange)
          };
        });
      }
    }, processingTime);

    return newTransaction.hash;
  }, []);

  // Auto-connect if previously connected
  useEffect(() => {
    const savedWallet = localStorage.getItem('massa-wallet-connected');
    if (savedWallet) {
      try {
        const walletData = JSON.parse(savedWallet);
        setWalletState(walletData);
        
        // Generate some transaction history for returning users
        const mockTransactions: Transaction[] = [];
        for (let i = 0; i < 8; i++) {
          mockTransactions.push({
            id: `tx-saved-${i}`,
            type: ['deposit', 'mint', 'repay'][Math.floor(Math.random() * 3)] as any,
            amount: Math.random() * 500 + 100,
            asset: Math.random() > 0.5 ? 'MAS' : 'zMASD',
            status: 'confirmed',
            hash: `0x${Math.random().toString(16).substring(2, 66)}`,
            timestamp: new Date(Date.now() - Math.random() * 86400000 * 7),
            gasUsed: Math.floor(Math.random() * 100000) + 21000,
          });
        }
        setTransactions(mockTransactions);
      } catch (error) {
        console.error('Failed to restore wallet state:', error);
        localStorage.removeItem('massa-wallet-connected');
      }
    }
  }, []);

  // Save wallet state
  useEffect(() => {
    if (walletState.isConnected) {
      localStorage.setItem('massa-wallet-connected', JSON.stringify(walletState));
    }
  }, [walletState]);

  // Simulate balance updates from protocol interactions
  useEffect(() => {
    if (walletState.isConnected) {
      const interval = setInterval(() => {
        // Small random balance fluctuations from staking rewards, etc.
        if (Math.random() < 0.1) { // 10% chance every interval
          setWalletState(prev => ({
            ...prev,
            balance: prev.balance + Math.random() * 5 // Small rewards
          }));
        }
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [walletState.isConnected]);

  return {
    walletState,
    isConnecting,
    transactions,
    availableWallets,
    showWalletModal,
    setShowWalletModal,
    connectWallet,
    disconnectWallet,
    sendTransaction,
  };
};