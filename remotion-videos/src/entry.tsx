import React from "react";
import { registerRoot } from "remotion";
import {
  SdkSolana,
  ChoOmChat,
  ShadowPay,
  Billpayx,
  ZkClaims,
  BytesZip,
  SilverSh,
  PrivacySdk,
  MatrixPrivacy,
  CliGitnpm,
  TheVirus,
  PrivPass,
  DeidentifyAi,
  LnkZip,
  DasrMarketplace,
} from "./compositions";

// Map composition IDs to project data keys
const projectData: Record<string, { name: string; tagline: string }> = {
  "sdk-solana": { name: "@thegit/solana", tagline: "Privacy SDK for Solana" },
  "choom-chat": { name: "ChoOm.chat", tagline: "Quantum-Secure Messaging" },
  "shadowpay": { name: "shadowpay", tagline: "Shadow Pay" },
  "billpayx-com": { name: "billpayx.com", tagline: "Stealth Payments" },
  "zk-claims": { name: "zk.claims", tagline: "Zero-Knowledge Claims" },
  "bytes-zip": { name: "bytes.zip", tagline: "Privacy Cash" },
  "silver-sh": { name: "silver.sh", tagline: "CLI Privacy Tool" },
  "privacy-sdk": { name: "privacy-sdk", tagline: "Privacy Toolkit" },
  "matrix-privacy": { name: "matrix-privacy", tagline: "E2E Encrypted Chat" },
  "cli-gitnpm": { name: "cli-gitnpm", tagline: "Git Privacy" },
  "thevirus-zip": { name: "thevirus.zip", tagline: "Gamified Privacy" },
  "priv-pass-xyz": { name: "priv.pass.xyz", tagline: "Privacy Pass" },
  "deidentify-ai": { name: "deidentify.ai", tagline: "AI Privacy" },
  "lnk-zip": { name: "lnk.zip", tagline: "Secure Links" },
  "dasr-marketplace": { name: "dasr-marketplace", tagline: "Private DeFi" },
};

const compositionList = [
  { id: "sdk-solana", comp: SdkSolana },
  { id: "choom-chat", comp: ChoOmChat },
  { id: "shadowpay", comp: ShadowPay },
  { id: "billpayx-com", comp: Billpayx },
  { id: "zk-claims", comp: ZkClaims },
  { id: "bytes-zip", comp: BytesZip },
  { id: "silver-sh", comp: SilverSh },
  { id: "privacy-sdk", comp: PrivacySdk },
  { id: "matrix-privacy", comp: MatrixPrivacy },
  { id: "cli-gitnpm", comp: CliGitnpm },
  { id: "thevirus-zip", comp: TheVirus },
  { id: "priv-pass-xyz", comp: PrivPass },
  { id: "deidentify-ai", comp: DeidentifyAi },
  { id: "lnk-zip", comp: LnkZip },
  { id: "dasr-marketplace", comp: DasrMarketplace },
];

const App = () => {
  const [selectedId, setSelectedId] = React.useState("sdk-solana");
  const selected = compositionList.find((c) => c.id === selectedId);

  return (
    <>
      {/* Render all compositions invisibly to register them */}
      {compositionList.map((item) => (
        <div key={item.id} style={{ display: "none" }}>{item.comp}</div>
      ))}

      {/* UI for selection */}
      <div style={{ padding: 40, background: "#0A0A0F", minHeight: "100vh", fontFamily: "system-ui", color: "white" }}>
        <h1 style={{ marginBottom: 20 }}>Solana Privacy Hackathon Videos</h1>
        <p style={{ marginBottom: 20, color: "#888" }}>Render with: npx remotion render src/entry.tsx [id] out/[id].mp4</p>
        <div style={{ marginBottom: 20 }}>
          <label style={{ marginRight: 10 }}>Select project:</label>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} style={{ padding: 8, fontSize: 16 }}>
            {compositionList.map((item) => <option key={item.id} value={item.id}>{item.id}</option>)}
          </select>
        </div>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {compositionList.map((item) => {
            const data = projectData[item.id];
            return (
              <div key={item.id} style={{ padding: 15, background: "#1A1A2E", borderRadius: 8, border: item.id === selectedId ? `2px solid #9945FF` : "2px solid transparent" }}>
                <strong>{data?.name || item.id}</strong>
                <br />
                <span style={{ color: "#888", fontSize: 12 }}>{data?.tagline}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

registerRoot(App);
