const { ethers } = require('ethers');
const fs = require('fs');

async function main() {
    console.log("🚀 Starting Direct-Auth Deployment...");

    // 1. Load CDP Credentials
    const keyData = JSON.parse(fs.readFileSync('cdp_key.json', 'utf8'));
    
    // 2. Setup RPC with your CDP API Key for Gas Coverage
    // We use the Base Mainnet RPC with a Basic Auth header
    const auth = Buffer.from(`${keyData.name}:${keyData.privateKey}`).toString('base64');
    const provider = new ethers.JsonRpcProvider('https://mainnet.base.org', null, {
        staticNetwork: true,
        headers: { Authorization: `Basic ${auth}` }
    });

    // 3. Extract Key from wallet_secret.txt
    const raw = fs.readFileSync('wallet_secret.txt', 'utf8').trim();
    const hexKey = '0x' + Buffer.from(raw, 'base64').slice(-32).toString('hex');
    const wallet = new ethers.Wallet(hexKey, provider);
    
    console.log(`✅ Signer: ${wallet.address}`);

    // 4. Contract Logic
    const bytecode = fs.readFileSync('Contract_Bytecode.bin', 'utf8').trim();
    const abi = JSON.parse(fs.readFileSync('Contract_ABI.json', 'utf8'));
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    console.log("⛽ Broadcasting via CDP-Auth RPC...");

    // Hardcode gas values to ensure the RPC sees the request
    const contract = await factory.deploy("0xa97684ead0e45119da10d2ac23a5f0912a50f40d", {
        gasLimit: 2000000,
        gasPrice: ethers.parseUnits('0.1', 'gwei')
    });

    console.log(`⏳ TX Sent: ${contract.deploymentTransaction().hash}`);
    await contract.waitForDeployment();
    
    console.log("-----------------------------------------");
    console.log("✅ SUCCESS!");
    console.log(`📜 ADDRESS: ${await contract.getAddress()}`);
    console.log("-----------------------------------------");
}

main().catch((err) => {
    console.error("❌ ERROR:", err.message);
});
