import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { motion } from "framer-motion";

const projectData: Record<string, {
  name: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  codeTextColor?: string;
  npmCommand?: string;
  problemPoints: string[];
  solutionPoints: string[];
  features: string[];
}> = {
  "sdk-solana": {
    name: "@thegit/solana",
    tagline: "Privacy SDK for Solana",
    primaryColor: "#0A0A0F",
    secondaryColor: "#1A1A2E",
    accentColor: "#9945FF",
    codeTextColor: "#00FF00",
    npmCommand: "npm install @thegit/solana",
    problemPoints: ["Building privacy is hard on Solana", "No unified API for ZK proofs and stealth addresses", "Complex cryptography requires expertise"],
    solutionPoints: ["npm install @thegit/solana", "import { SolanaPrivacySDK } from '@thegit/solana'", "Stealth address generation built-in"],
    features: ["ZK Primitives", "Stealth Module", "Transfer Module"],
  },
  "choom-chat": {
    name: "ChoOm.chat",
    tagline: "Quantum-Secure Messaging",
    primaryColor: "#0A0A0F",
    secondaryColor: "#1A1A2E",
    accentColor: "#9D00FF",
    codeTextColor: "#00FFFF",
    npmCommand: "npm install quantum-terminal",
    problemPoints: ["Current encryption is vulnerable to quantum computers", "Messages can be intercepted and stored for later decryption", "No truly post-quantum secure messaging exists"],
    solutionPoints: ["Kyber-768 post-quantum key encapsulation", "Hybrid encryption: Kyber + X25519 + ChaCha20", "End-to-end encrypted with forward secrecy"],
    features: ["Kyber-768 PQC", "Hybrid Encryption", "Forward Secrecy"],
  },
  "billpayx.com": {
    name: "billpayx.com",
    tagline: "Stealth Payments",
    primaryColor: "#0A0A0F",
    secondaryColor: "#1A1A2E",
    accentColor: "#14F195",
    codeTextColor: "#00FF00",
    npmCommand: "npm install billpayx",
    problemPoints: ["Payment tracking reveals spending habits", "Merchant fees are too high", "No privacy in traditional payments"],
    solutionPoints: ["Stealth addresses hide recipient identity", "Zero-knowledge proofs verify transactions", "Low-fee private payment processing"],
    features: ["Stealth Addresses", "ZK Verification", "Low Fees"],
  },
  "shadowpay": {
    name: "shadowpay",
    tagline: "Shadow Pay",
    primaryColor: "#0A0A0F",
    secondaryColor: "#1A1A2E",
    accentColor: "#7C3AED",
    codeTextColor: "#A855F7",
    npmCommand: "npm install @shadowpay/sdk",
    problemPoints: ["Blockchain transactions are fully transparent", "Payment history can be linked to real identity", "No privacy in DeFi or gaming transactions"],
    solutionPoints: ["ZK stealth addresses hide recipient identity", "Pedersen commitments hide transaction amounts", "Gamification with Shadow NFT rewards"],
    features: ["Stealth Addresses", "Pedersen Commitments", "Game Rewards"],
  },
  "zk-claims": {
    name: "zk.claims",
    tagline: "Zero-Knowledge Claims",
    primaryColor: "#0A0A0F",
    secondaryColor: "#1A1A2E",
    accentColor: "#FFD700",
    codeTextColor: "#FFD700",
    npmCommand: "npm install zk-claims",
    problemPoints: ["Sharing personal data exposes privacy", "No way to prove attributes without revealing them", "Identity verification is invasive"],
    solutionPoints: ["ZK circuits prove claims without data exposure", "Selective disclosure of attributes", "Trustless credential verification"],
    features: ["ZK Circuits", "Selective Disclosure", "Trustless Proofs"],
  },
  "bytes.zip": {
    name: "bytes.zip",
    tagline: "Privacy Cash",
    primaryColor: "#0A0A0F",
    secondaryColor: "#1A1A2E",
    accentColor: "#F97316",
    codeTextColor: "#FB923C",
    problemPoints: ["Digital payments leave traces", "Financial privacy is disappearing", "Centralized systems track everything"],
    solutionPoints: ["Anonymous transaction system", "Encrypted transaction data", "Decentralized privacy preservation"],
    features: ["Anonymous Tx", "Encrypted Data", "Decentralized"],
  },
  "silver.sh": {
    name: "silver.sh",
    tagline: "CLI Privacy Tool",
    primaryColor: "#0A0A0F",
    secondaryColor: "#1A1A2E",
    accentColor: "#22C55E",
    codeTextColor: "#4ADE80",
    npmCommand: "npm i silver.sh",
    problemPoints: ["Privacy tools are too complex", "Command-line lacks good options", "No unified CLI for privacy tasks"],
    solutionPoints: ["Simple CLI for encryption and decryption", "File hashing and verification", "Secure communication utilities"],
    features: ["Encryption CLI", "File Verification", "Secure Comms"],
  },
  "privacy-sdk": {
    name: "privacy-sdk",
    tagline: "Privacy Toolkit",
    primaryColor: "#0A0A0F",
    secondaryColor: "#1A1A2E",
    accentColor: "#3B82F6",
    codeTextColor: "#60A5FA",
    npmCommand: "npm install @thegit/privacy",
    problemPoints: ["Building privacy features takes too long", "No comprehensive privacy library exists", "Integration complexity slows development"],
    solutionPoints: ["All-in-one privacy toolkit", "Easy API for common privacy patterns", "TypeScript support out of the box"],
    features: ["All-in-One", "Easy API", "TypeScript Support"],
  },
  "matrix-privacy": {
    name: "matrix-privacy",
    tagline: "E2E Encrypted Chat",
    primaryColor: "#0A0A0F",
    secondaryColor: "#1A1A2E",
    accentColor: "#22C55E",
    codeTextColor: "#4ADE80",
    problemPoints: ["Most chat apps read your messages", "Metadata is often exposed", "End-to-end encryption is rare"],
    solutionPoints: ["True end-to-end encryption", "Metadata minimization", "Open source and auditable"],
    features: ["E2E Encryption", "Metadata Privacy", "Open Source"],
  },
  "cli-gitnpm": {
    name: "cli-gitnpm",
    tagline: "Git Privacy",
    primaryColor: "#0A0A0F",
    secondaryColor: "#1A1A2E",
    accentColor: "#EF4444",
    codeTextColor: "#F87171",
    npmCommand: "npx cli-gitnpm publish",
    problemPoints: ["npm publishing reveals your identity", "No way to publish packages anonymously", "Git history can expose contributors"],
    solutionPoints: ["Anonymous package publishing", "Tor support for hidden publishing", "Zero-knowledge proof of authorship"],
    features: ["Anonymous Publish", "Tor Support", "ZK Authorship"],
  },
  "thevirus.zip": {
    name: "thevirus.zip",
    tagline: "Gamified Privacy",
    primaryColor: "#0A0A0F",
    secondaryColor: "#1A1A2E",
    accentColor: "#00FF00",
    codeTextColor: "#4ADE80",
    problemPoints: ["Privacy education is boring", "People don't understand encryption", "Security best practices are ignored"],
    solutionPoints: ["Gamified learning experience", "Earn rewards for privacy mastery", "Interactive cryptography challenges"],
    features: ["Gamification", "Rewards", "Interactive Learning"],
  },
  "priv-pass.xyz": {
    name: "priv.pass.xyz",
    tagline: "Privacy Pass",
    primaryColor: "#0A0A0F",
    secondaryColor: "#1A1A2E",
    accentColor: "#D4D4D4",
    codeTextColor: "#E5E5E5",
    problemPoints: ["Online accounts require too much info", "Credentials are often over-collected", "No way to prove attributes privately"],
    solutionPoints: ["Anonymous credential issuance", "Zero-knowledge attribute proofs", "Revocable privacy passes"],
    features: ["Anonymous Credentials", "ZK Proofs", "Revocable"],
  },
  "deidentify.ai": {
    name: "deidentify.ai",
    tagline: "AI Privacy",
    primaryColor: "#0A0A0F",
    secondaryColor: "#1A1A2E",
    accentColor: "#8B5CF6",
    codeTextColor: "#A78BFA",
    problemPoints: ["AI systems consume personal data", "Training data often contains PII", "No privacy in ML pipelines"],
    solutionPoints: ["Federated learning support", "Differential privacy integration", "On-device inference only"],
    features: ["Federated Learning", "Differential Privacy", "On-Device AI"],
  },
  "lnk.zip": {
    name: "lnk.zip",
    tagline: "Secure Links",
    primaryColor: "#0A0A0F",
    secondaryColor: "#1A1A2E",
    accentColor: "#06B6D4",
    codeTextColor: "#22D3EE",
    problemPoints: ["Link sharing exposes metadata", "No expiration control", "Links can be intercepted"],
    solutionPoints: ["Encrypted link payloads", "Configurable expiration", "Access logging with privacy"],
    features: ["Encrypted Links", "Expiration Control", "Private Logs"],
  },
  "dasr-marketplace": {
    name: "dasr-marketplace",
    tagline: "Private DeFi",
    primaryColor: "#0A0A0F",
    secondaryColor: "#1A1A2E",
    accentColor: "#10B981",
    codeTextColor: "#34D399",
    problemPoints: ["DeFi trading is fully transparent", "MEV bots exploit transaction ordering", "No privacy in on-chain trading"],
    solutionPoints: ["Private order matching", "MEV protection built-in", "ZK-based trade verification"],
    features: ["Private Orders", "MEV Protection", "ZK Verification"],
  },
};

// CodeBlock component (inline to avoid imports)
const CodeBlock = ({ lines, primaryColor = "#0A0A0F", codeTextColor = "#00FF00", accentColor = "#9945FF", highlightLines = [] }: { lines: string[]; primaryColor?: string; codeTextColor?: string; accentColor?: string; highlightLines?: number[] }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: primaryColor, padding: 40, fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace", fontSize: 24, lineHeight: 1.8 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20, paddingBottom: 15, borderBottom: `1px solid ${accentColor}30` }}>
        <span style={{ color: codeTextColor, opacity: 0.6 }}>typescript</span>
      </div>
      <div>
        {lines.map((line, index) => {
          const isHighlighted = highlightLines.includes(index);
          const lineOpacity = Math.min(1, Math.max(0, (frame - index * 10) / 30));
          return (
            <motion.div key={index} style={{ padding: "4px 0", background: isHighlighted ? `${accentColor}15` : "transparent", borderLeft: isHighlighted ? `3px solid ${accentColor}` : "none", paddingLeft: isHighlighted ? 12 : 0, opacity: lineOpacity }}>
              <span style={{ color: codeTextColor }}>{line}</span>
            </motion.div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// FeatureCard component
const FeatureCard = ({ title, primaryColor = "#0A0A0F", accentColor = "#9945FF", delay = 0 }: { title: string; primaryColor?: string; accentColor?: string; delay?: number }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(1, Math.max(0, (frame - delay) / 20));
  const scale = 0.8 + 0.2 * Math.sin((frame - delay) / 30);
  return (
    <motion.div style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}DD 100%)`, border: `2px solid ${accentColor}60`, borderRadius: 16, padding: 30, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 280, minHeight: 180, gap: 15 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity, scale }} transition={{ duration: 0.3 }}>
      <span style={{ color: "white", fontSize: 22, fontWeight: 600, textAlign: "center" }}>{title}</span>
    </motion.div>
  );
};

// FeaturesSlide component
const FeaturesSlide = ({ features, primaryColor = "#0A0A0F", accentColor = "#9945FF" }: { features: string[]; primaryColor?: string; accentColor?: string }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, #1a1a2e 100%)`, justifyContent: "center", alignItems: "center" }}>
      <motion.div style={{ position: "absolute", top: 80, fontSize: 42, fontWeight: 700, color: "white" }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: Math.min(1, frame / 30), y: 0 }}>FEATURES</motion.div>
      <div style={{ display: "flex", gap: 30, flexWrap: "wrap", justifyContent: "center", padding: 40 }}>
        {features.map((feature, index) => (
          <FeatureCard key={index} title={feature} primaryColor={primaryColor} accentColor={accentColor} delay={30 + index * 15} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// CTASlide component
const CTASlide = ({ text, primaryColor = "#0A0A0F", accentColor = "#9945FF", npmCommand, codeTextColor = "#00FF00" }: { text: string; primaryColor?: string; accentColor?: string; npmCommand?: string; codeTextColor?: string }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, #1a1a2e 100%)`, justifyContent: "center", alignItems: "center" }}>
      <motion.div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: Math.min(1, (frame - 15) / 30), scale: 1 }} transition={{ duration: 0.5 }}>
        <div style={{ fontSize: 48, fontWeight: 800, color: "white", textAlign: "center" }}>{text}</div>
        {npmCommand && (
          <motion.div style={{ background: `${accentColor}20`, border: `2px solid ${accentColor}`, borderRadius: 12, padding: "15px 30px", fontFamily: "monospace", fontSize: 28, color: codeTextColor, marginTop: 10 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: Math.min(1, (frame - 30) / 20), y: 0 }} transition={{ duration: 0.3 }}>
            {npmCommand}
          </motion.div>
        )}
      </motion.div>
    </AbsoluteFill>
  );
};

// Main Video component
export function Video({ projectKey }: { projectKey: string }) {
  const frame = useCurrentFrame();
  const project = projectData[projectKey];
  if (!project) return null;

  const SECTIONS = { intro: 240, problem: 240, solution: 600, features: 300, cta: 120 };
  const introEnd = SECTIONS.intro;
  const problemEnd = introEnd + SECTIONS.problem;
  const solutionEnd = problemEnd + SECTIONS.solution;
  const featuresEnd = solutionEnd + SECTIONS.features;
  const problemFrame = Math.max(0, frame - introEnd);
  const solutionFrame = Math.max(0, frame - problemEnd);
  const featuresFrame = Math.max(0, frame - solutionEnd);

  return (
    <AbsoluteFill style={{ background: project.primaryColor }}>
      {/* Intro */}
      <AbsoluteFill style={{ opacity: frame < introEnd ? 1 : 0 }}>
        <div style={{ background: `linear-gradient(135deg, ${project.primaryColor} 0%, ${project.secondaryColor} 100%)`, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <motion.div style={{ fontSize: 88, fontWeight: 900, color: "white", textAlign: "center" }} initial={{ opacity: 0, y: 50 }} animate={{ opacity: Math.min(1, Math.min(frame, introEnd) / 30), y: 0 }}>{project.name}</motion.div>
          <motion.div style={{ width: 150, height: 6, background: project.accentColor, marginTop: 25, borderRadius: 3 }} initial={{ scaleX: 0 }} animate={{ scaleX: Math.min(1, (Math.min(frame, introEnd) - 20) / 30) }} />
          <motion.div style={{ fontSize: 32, color: "rgba(255,255,255,0.8)", textAlign: "center" }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: Math.min(1, (Math.min(frame, introEnd) - 40) / 30), y: 0 }}>{project.tagline}</motion.div>
        </div>
      </AbsoluteFill>

      {/* Problem */}
      <AbsoluteFill style={{ opacity: frame >= introEnd && frame < problemEnd ? 1 : 0 }}>
        <div style={{ background: `linear-gradient(135deg, ${project.primaryColor} 0%, ${project.secondaryColor} 100%)`, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 80 }}>
          <motion.div style={{ fontSize: 48, fontWeight: 700, color: "white", marginBottom: 50 }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: Math.min(1, problemFrame / 20), y: 0 }}>THE PROBLEM</motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            {project.problemPoints.map((point, i) => (
              <motion.div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }} initial={{ opacity: 0, x: -50 }} animate={{ opacity: Math.min(1, (problemFrame - i * 15) / 30), x: 0 }}>
                <div style={{ width: 45, height: 45, borderRadius: "50%", background: project.accentColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "white" }}>!</div>
                <span style={{ fontSize: 28, color: "rgba(255,255,255,0.9)" }}>{point}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </AbsoluteFill>

      {/* Solution */}
      <AbsoluteFill style={{ opacity: frame >= problemEnd && frame < solutionEnd ? 1 : 0 }}>
        <div style={{ background: `linear-gradient(135deg, ${project.primaryColor} 0%, ${project.secondaryColor} 100%)`, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 60 }}>
          <motion.div style={{ fontSize: 48, fontWeight: 700, color: "white", marginBottom: 40 }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: Math.min(1, solutionFrame / 20), y: 0 }}>THE SOLUTION</motion.div>
          <motion.div style={{ width: "100%", maxWidth: 1000, marginTop: 20 }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: Math.min(1, (solutionFrame - 20) / 30), scale: 1 }}>
            <CodeBlock lines={project.solutionPoints} primaryColor={project.primaryColor} codeTextColor={project.codeTextColor || "#00FF00"} accentColor={project.accentColor} highlightLines={[0]} />
          </motion.div>
        </div>
      </AbsoluteFill>

      {/* Features */}
      <AbsoluteFill style={{ opacity: frame >= solutionEnd && frame < featuresEnd ? 1 : 0 }}>
        <FeaturesSlide features={project.features} primaryColor={project.primaryColor} accentColor={project.accentColor} />
      </AbsoluteFill>

      {/* CTA */}
      <AbsoluteFill style={{ opacity: frame >= featuresEnd ? 1 : 0 }}>
        <CTASlide text={project.npmCommand || "Get Started"} primaryColor={project.primaryColor} accentColor={project.accentColor} npmCommand={project.npmCommand} codeTextColor={project.codeTextColor || "#00FF00"} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
