const express = require("express");
const cors = require("cors");
const ethers = require("ethers");
const { create } = require("ipfs-http-client");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization:
      "Basic " +
      Buffer.from(
        process.env.INFURA_PROJECT_ID + ":" + process.env.INFURA_PROJECT_SECRET
      ).toString("base64"),
  },
});

const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const ResolverV2ABI = [
  "function requestName(string name) external",
  "function getNames(address wallet) view returns (string[])"
];
const GrownFolkCallABI = [
  "function initiateCallByName(string recipientName, bytes32 metadataHash) external"
];
const GrownFolkMailABI = [
  "function sendMessageByName(string recipientName, string content) external"
];

// Load approved users (emails to wallets)
const approvedUsers = require("./approvedUsers.json");

// Contract addresses
const RESOLVER_V2_2025 = process.env.RESOLVER_V2_2025;
const GROWN_FOLK_CALL = process.env.GROWN_FOLK_CALL;
const GROWN_FOLK_MAIL = process.env.GROWN_FOLK_MAIL;

app.get("/", (req, res) => {
  res.send("GrownFolk Mail Backend is running.");
});

app.post("/login", (req, res) => {
  const { email } = req.body;
  const wallet = approvedUsers[email.toLowerCase()];
  if (!wallet) {
    return res.json({ success: false, error: "Email not approved" });
  }
  res.json({ success: true, wallet });
});

app.post("/request-name", async (req, res) => {
  const { wallet, name } = req.body;
  try {
    const resolver = new ethers.Contract(RESOLVER_V2_2025, ResolverV2ABI, signer);
    const tx = await resolver.requestName(name);
    await tx.wait();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.post("/initiate-call", async (req, res) => {
  const { wallet, recipient, metadataHash } = req.body;
  try {
    const call = new ethers.Contract(GROWN_FOLK_CALL, GrownFolkCallABI, signer);
    const tx = await call.initiateCallByName(recipient, metadataHash);
    await tx.wait();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.post("/send-message", async (req, res) => {
  const { wallet, recipient, content } = req.body;
  try {
    const mail = new ethers.Contract(GROWN_FOLK_MAIL, GrownFolkMailABI, signer);
    const tx = await mail.sendMessageByName(recipient, content);
    await tx.wait();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.post("/upload-ipfs", async (req, res) => {
  const { metadata } = req.body;
  try {
    const { path } = await ipfs.add(JSON.stringify(metadata));
    res.json({ success: true, hash: path });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
