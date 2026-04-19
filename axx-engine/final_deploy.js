const { Coinbase, Wallet } = require('@coinbase/coinbase-sdk');
const fs = require('fs');

async function main() {
  try {
    console.log("📡 Initializing CDP Final Launch...");
    Coinbase.configureFromJson({ filePath: 'cdp_key.json' });

    // Creates the Smart Account needed to trigger the Paymaster
    const wallet = await Wallet.create({ networkId: 'base-mainnet' });
    console.log(`✅ Smart Account Prepared: ${await wallet.getAddress()}`);

    console.log("🚀 Requesting Sponsored Deployment of AxionFlashEngine...");
    const contract = await wallet.deployContract({
      bytecode: fs.readFileSync('Contract_Bytecode.bin', 'utf8').trim(),
      abi: JSON.parse(fs.readFileSync('Contract_ABI.json', 'utf8')),
      args: ["0xa97684ead0e45119da10d2ac23a5f0912a50f40d"] // Base Mainnet Agave Pool
    }, { gasless: true });

    console.log("⏳ Bundler is processing... (Using $100 Credits)");
    await contract.wait();
    
    console.log("\n" + "=".repeat(41));
    console.log("🎉 DEPLOYMENT SUCCESSFUL!");
    console.log(`📜 ADDRESS: ${contract.getAddress()}`);
    console.log("=".repeat(41));

  } catch (err) {
    console.error("❌ Launch Failed.");
    console.error("Reason:", err.apiMessage || err.message);
  }
}
main();
