const { Coinbase, Wallet } = require('@coinbase/coinbase-sdk');

async function test() {
  try {
    console.log("📡 Attempting JSON Configuration...");
    Coinbase.configureFromJson({ filePath: 'cdp_key.json' });

    console.log("📡 Creating Test Wallet...");
    const wallet = await Wallet.create({ networkId: 'base-mainnet' });
    
    console.log("✅ SUCCESS! Wallet Address: " + await wallet.getAddress());
  } catch (err) {
    console.log("❌ RAW ERROR DUMP:");
    console.dir(err, { depth: null }); // This will show every hidden property
    
    if (err.httpCode) console.log("HTTP Code:", err.httpCode);
    if (err.response && err.response.data) console.log("Data:", err.response.data);
  }
}
test();
