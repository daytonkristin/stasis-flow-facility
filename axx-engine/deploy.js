const ethers = require("ethers");
const fs = require("fs");

async function main() {
    // 1. Connect to your Infura Tunnel
    const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log("Deploying from:", wallet.address);

    // 2. Load the Bytecode and ABI (generated from your contract)
    const abi = JSON.parse(fs.readFileSync("Contract_ABI.json"));
    const bytecode = fs.readFileSync("Contract_Bytecode.bin").toString();

    // 3. The Aave V3 Provider for Base
    const addressProvider = "0xa97684ead0e45119da10d2ac23a5f0912a50f40d";

    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy(addressProvider);

    console.log("Deployment Pending...");
    await contract.deployed();

    console.log("CONTRACT DEPLOYED TO:", contract.address);
}

main();

