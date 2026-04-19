const { Coinbase, Wallet } = require('@coinbase/coinbase-sdk');
const fs = require('fs');

// Path to the file you moved from Downloads
const keyFile = JSON.parse(fs.readFileSync('cdp_key.json', 'utf8'));

Coinbase.configure({ apiKeyName: keyFile.name, privateKey: keyFile.privateKey });

async function fuel() {
  console.log("⚡ Authenticating with Coinbase CDP...");
  
  // This taps into your $100 credit pool
  const wallet = await Wallet.create({ networkId: Coinbase.networks.BaseMainnet });
  const destination = "0x586bfa1087aC5763D911C54D83495b48F100bd5C";
  
  console.log(`🚀 Dispatching 0.002 ETH to ${destination}...`);
  
  const transfer = await wallet.createTransfer({
    amount: 0.002,
    assetId: Coinbase.assets.Eth,
    destination: destination,
  });

  await transfer.wait();
  console.log("✅ Gas Tank Refilled!");
  console.log("🔗 View on BaseScan:", transfer.getTransactionLink());
}

fuel().catch((err) => {
  console.error("❌ Fueling failed. Check if cdp_key.json is valid.");
  console.error(err);
});

