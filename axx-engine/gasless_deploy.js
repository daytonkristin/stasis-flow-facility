const { Coinbase, Wallet } = require('@coinbase/coinbase-sdk');
const fs = require('fs');

async function main() {
  try {
    const keyData = JSON.parse(fs.readFileSync('cdp_key.json', 'utf8'));
    const formattedKey = keyData.privateKey.replace(/\\n/g, '\n');
    
    Coinbase.configure({ apiKeyName: keyData.name, privateKey: formattedKey });

    console.log("🛠️  Testing API Connection...");
    
    // Explicitly catching the create call to find the "Undefined" source
    const wallet = await Wallet.create({ networkId: 'base-mainnet' }).catch(e => {
        console.log("❌ SDK Internal Error Check:");
        console.dir(e); // This will dump the full object so we can see the status code
        throw new Error("SDK_CREATE_FAILED");
    });
    
    console.log("✅ Wallet Created: " + await wallet.getAddress());

    const contract = await wallet.deployContract({
      bytecode: fs.readFileSync('Contract_Bytecode.bin', 'utf8').trim(),
      abi: JSON.parse(fs.readFileSync('Contract_ABI.json', 'utf8')),
      args: ["0xa97684ead0e45119da10d2ac23a5f0912a50f40d"]
    }, { gasless: true });

    console.log("⏳ Confirmation pending...");
    await contract.wait();
    console.log("✅ LIVE AT: " + contract.getAddress());

  } catch (err) {
    if (err.message !== "SDK_CREATE_FAILED") {
        console.error("❌ Final Error Detail:", err.message);
    }
  }
}

main();
