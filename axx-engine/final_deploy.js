const { ethers } = require('ethers');
const fs = require('fs');

async function main() {
  try {
    const RPC_URL = "https://api.developer.coinbase.com/rpc/v1/base/zWsy2Kloj2Ycn4VNIGpEvwOFFKoSY6Em";
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    const raw = fs.readFileSync('wallet_secret.txt', 'utf8').trim();
    const hexKey = '0x' + Buffer.from(raw, 'base64').slice(-32).toString('hex');
    const wallet = new ethers.Wallet(hexKey, provider);

    const abi = JSON.parse(fs.readFileSync('Contract_ABI.json', 'utf8'));
    const bytecode = fs.readFileSync('Contract_Bytecode.bin', 'utf8').trim();
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    console.log("🚀 Broadcasting with Manual Gas (Testing Paymaster Pickup)...");

    // We manually set gas limits to bypass the 'estimateGas' failure
    const contract = await factory.deploy("0xa97684ead0e45119da10d2ac23a5f0912a50f40d", {
      gasLimit: 1000000, 
      maxFeePerGas: ethers.parseUnits('0.1', 'gwei'),
      maxPriorityFeePerGas: ethers.parseUnits('0.1', 'gwei')
    });

    console.log("⏳ TX Sent:", contract.deploymentTransaction().hash);
    await contract.waitForDeployment();
    console.log("🎉 SUCCESS! ADDRESS:", await contract.getAddress());

  } catch (err) {
    if (err.message.includes("insufficient funds")) {
       console.error("❌ Paymaster rejected standard transaction.");
       console.log("💡 Last Resort: We must wait for the SDK 429 to clear to use the Smart Account flow.");
    } else {
       console.error("❌ Error:", err.shortMessage || err.message);
    }
  }
}
main();
