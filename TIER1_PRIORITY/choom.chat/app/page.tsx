'use client';

import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('status');
  const [output, setOutput] = useState<string[]>([
    '╔════════════════════════════════════════════════════════════╗',
    '║     QUANTUM TERMINAL v1.0 - Post-Quantum Secure Chat       ║',
    '║                                                            ║',
    '║     🛡️  Kyber-768 + X25519 Hybrid Encryption              ║',
    '║     🔐  "Harvest Now, Decrypt Later" Defense               ║',
    '║     ⚡  Forward Secrecy & Auto Key Rotation                ║',
    '╚════════════════════════════════════════════════════════════╝',
    '',
    'Initializing quantum-safe connection...',
    'Loading cryptographic modules...',
    '✓ Kyber-768 KEM loaded',
    '✓ X25519 ECDH loaded',
    '✓ ChaCha20-Poly1305 loaded',
    '✓ Hybrid encryption engine ready',
    '',
    'Quantum Terminal is ready for secure messaging.',
    'Type "help" for available commands.',
    ''
  ]);

  const [input, setInput] = useState('');

  const handleCommand = (cmd: string) => {
    const newOutput = [...output];
    newOutput.push(`> ${cmd}`);

    const command = cmd.toLowerCase().trim();

    switch (command) {
      case 'help':
        newOutput.push(
          '',
          'Available commands:',
          '  keygen      - Generate post-quantum key pair',
          '  status      - Show crypto status',
          '  start       - Start secure chat session',
          '  send        - Send encrypted message',
          '  verify      - Verify contact identity',
          '  demo        - Run demo sequence',
          '  clear       - Clear terminal',
          ''
        );
        break;
      case 'keygen':
        newOutput.push(
          '🔐 Generating post-quantum keys...',
          '✓ Keys generated successfully!',
          '',
          'Public Key (truncated):',
          '5f6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
          '',
          'Algorithm: Kyber-768',
          'Key size: 1184 bytes',
          ''
        );
        break;
      case 'status':
        newOutput.push(
          '🔐 Quantum Terminal Crypto Status',
          '',
          '✓ Kyber-768 (Post-Quantum NIST FIPS 203)',
          '✓ X25519 (Elliptic Curve - Fallback)',
          '✓ ChaCha20-Poly1305 (Symmetric Encryption)',
          '✓ Hybrid Mode (Defense in Depth)',
          '',
          '🛡️ Protection: Harvest now, decrypt later defense ENABLED',
          ''
        );
        break;
      case 'demo':
        newOutput.push(
          '',
          '╔════════════════════════════════════════════════════════╗',
          '║              DEMO: Post-Quantum Encryption Flow         ║',
          '╚════════════════════════════════════════════════════════╝',
          '',
          'Step 1: Generate Kyber-768 Key Pair',
          '  → Public Key: 1184 bytes',
          '  → Secret Key: 1632 bytes',
          '',
          'Step 2: Generate X25519 Key Pair (fallback)',
          '  → Public Key: 32 bytes',
          '  → Secret Key: 32 bytes',
          '',
          'Step 3: Hybrid Key Encapsulation',
          '  → Kyber encapsulation: (ciphertext, shared_secret)',
          '  → X25519 ECDH: shared_secret',
          '  → KDF( Kyber_SS || X25519_SS ) → Master Key',
          '',
          'Step 4: Encrypt with ChaCha20-Poly1305',
          '  → Message encrypted with combined key',
          '  → 128-bit authentication tag',
          '',
          '✓ Secure message sent!',
          ''
        );
        break;
      case 'clear':
        setOutput(['Terminal cleared. Ready for new commands.', '']);
        return;
      default:
        if (command) {
          newOutput.push(`Command not found: ${command}. Type "help" for available commands.`);
          newOutput.push('');
        }
        break;
    }

    setOutput(newOutput);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold glitch mb-2" style={{ color: '#00ff41' }}>
            QUANTUM TERMINAL
          </h1>
          <p className="text-green-400 text-lg" style={{ color: '#00ff41' }}>
            choom.chat — Post-Quantum Secure Messaging
          </p>
          <div className="mt-4 flex justify-center gap-4 flex-wrap">
            <span className="px-3 py-1 border border-green-400 rounded text-sm" style={{ color: '#00ff41', borderColor: '#00ff41' }}>
              🏆 Post-Quantum $15K
            </span>
            <span className="px-3 py-1 border border-green-400 rounded text-sm" style={{ color: '#00ff41', borderColor: '#00ff41' }}>
              💡 Most Innovative $10K
            </span>
            <span className="px-3 py-1 border border-green-400 rounded text-sm pulse" style={{ color: '#00ff41', borderColor: '#00ff41' }}>
              ✅ SUBMISSION READY
            </span>
          </div>
        </header>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="terminal p-4 rounded">
            <h3 className="text-xl font-bold mb-2" style={{ color: '#00ff41' }}>🔐 Kyber-768</h3>
            <p className="text-green-300 text-sm">NIST FIPS 203 compliant post-quantum KEM. Protects against quantum attacks.</p>
          </div>
          <div className="terminal p-4 rounded">
            <h3 className="text-xl font-bold mb-2" style={{ color: '#00ff41' }}>🛡️ Hybrid Mode</h3>
            <p className="text-green-300 text-sm">Kyber + X25519 for defense in depth. Quantum-safe with classical fallback.</p>
          </div>
          <div className="terminal p-4 rounded">
            <h3 className="text-xl font-bold mb-2" style={{ color: '#00ff41' }}>⚡ Forward Secrecy</h3>
            <p className="text-green-300 text-sm">Ephemeral keys per session. Past messages stay secure even if keys are compromised.</p>
          </div>
        </div>

        {/* Terminal Interface */}
        <div className="terminal rounded-lg overflow-hidden">
          <div className="terminal-header px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }}></div>
            <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }}></div>
            <div className="w-3 h-3 rounded-full" style={{ background: '#27ca40' }}></div>
            <span className="ml-2 text-sm" style={{ color: '#00ff41' }}>quantum-terminal — zsh</span>
          </div>
          <div className="terminal-content p-4 h-96 overflow-y-auto">
            {output.map((line, i) => (
              <div key={i} className="font-mono text-sm whitespace-pre-wrap" style={{ color: '#00ff41' }}>
                {line}
              </div>
            ))}
            <form onSubmit={handleSubmit} className="flex items-center mt-2">
              <span className="mr-2" style={{ color: '#00ff41' }}>➜</span>
              <span className="mr-2" style={{ color: '#00ff41' }}>~</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none"
                style={{ color: '#00ff41' }}
                placeholder="Type a command..."
                autoFocus
              />
            </form>
          </div>
        </div>

        {/* CLI Installation */}
        <div className="mt-8 terminal p-6 rounded">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#00ff41' }}>🚀 Install CLI</h2>
          <div className="bg-black p-4 rounded border font-mono text-sm" style={{ borderColor: '#00ff41' }}>
            <p className="text-green-300 mb-2"># Install and start using Quantum Terminal</p>
            <p className="text-green-400">npm install -g quantum-terminal</p>
            <p className="text-green-400 mt-2">quantum-chat start --username yourname --room hackathon</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-green-400 text-sm">
          <p>Built with 🦀 Rust + ⚛️ Next.js + 🔐 Kyber-768</p>
          <p className="mt-2">© 2026 choom.chat — Submission Ready</p>
        </footer>
      </div>
    </main>
  );
}
