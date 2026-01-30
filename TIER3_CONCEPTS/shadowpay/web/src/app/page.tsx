'use client';

import { useState, useEffect } from 'react';
import { ShadowPay } from '@shadowpay/sdk';

export default function ShadowPayDashboard() {
  const [shadowpay, setShadowpay] = useState<ShadowPay | null>(null);
  const [viewKey, setViewKey] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [paymentResult, setPaymentResult] = useState<string>('');
  const [stealthAddress, setStealthAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('1000');
  const [recipient, setRecipient] = useState<string>('');

  useEffect(() => {
    initializeShadowPay();
  }, []);

  const initializeShadowPay = async () => {
    const sp = new ShadowPay({ network: 'devnet' });
    await sp.initialize();
    setShadowpay(sp);
  };

  const generateKeys = async () => {
    if (!shadowpay) return;
    const keys = await shadowpay.generateReceiveKeys();
    setViewKey(keys.viewKey.join(','));
  };

  const createStealthAddress = async () => {
    if (!shadowpay || !viewKey) return;
    const viewKeyBytes = new Uint8Array(viewKey.split(',').map(Number));
    const address = await shadowpay.createStealthAddress(viewKeyBytes);
    setStealthAddress(address.stealth.address);
  };

  const makePayment = async () => {
    if (!shadowpay || !recipient || !amount) return;
    
    const result = await shadowpay.createPayment({
      amount: BigInt(amount),
      recipientViewKey: new Uint8Array(recipient.split(',').map(Number)),
      memo: 'Payment from dashboard',
    });
    
    setPaymentResult(`Payment created! Proof ID: ${result.proofId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">ShadowPay Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Key Management */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Key Management</h2>
          <button 
            onClick={generateKeys}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Generate Keys
          </button>
          {viewKey && (
            <div className="mt-4">
              <label className="block text-sm text-gray-400">View Key</label>
              <textarea 
                value={viewKey} 
                readOnly 
                className="w-full bg-gray-700 p-2 rounded mt-1"
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Stealth Address */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Create Stealth Address</h2>
          <button 
            onClick={createStealthAddress}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            Generate Address
          </button>
          {stealthAddress && (
            <div className="mt-4">
              <label className="block text-sm text-gray-400">Stealth Address</label>
              <input 
                value={stealthAddress} 
                readOnly 
                className="w-full bg-gray-700 p-2 rounded mt-1"
              />
            </div>
          )}
        </div>

        {/* Make Payment */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Make Payment</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400">Amount</label>
              <input 
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-700 p-2 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Recipient View Key</label>
              <textarea 
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter recipient's view key"
                className="w-full bg-gray-700 p-2 rounded mt-1"
                rows={3}
              />
            </div>
            <button 
              onClick={makePayment}
              className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 w-full"
            >
              Send Payment
            </button>
          </div>
          {paymentResult && (
            <div className="mt-4 p-3 bg-green-900 rounded">
              {paymentResult}
            </div>
          )}
        </div>

        {/* Balance */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Balance</h2>
          <div className="text-4xl font-bold text-green-400">
            {balance} SPL
          </div>
          <button className="mt-4 bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700">
            Prove Balance
          </button>
        </div>
      </div>
    </div>
  );
}
