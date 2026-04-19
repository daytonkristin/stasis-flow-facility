import asyncio
import os
from cdp import Coinbase, Wallet
from dotenv import load_dotenv

load_dotenv()

async def main():
    try:
        # 1. Configure using your JSON file
        Coinbase.configure_from_json("cdp_key.json")
        print("📡 CDP Connection Established.")

        # 2. Create the Smart Account for Base Mainnet
        print("📡 Creating Sponsored Smart Wallet...")
        wallet = await Wallet.create(network_id="base-mainnet")
        address = await wallet.default_address()
        print(f"✅ Wallet Address: {address.address_id}")

        # 3. Read Bytecode
        with open('Contract_Bytecode.bin', 'r') as f:
            bytecode = f.read().strip()
            if not bytecode.startswith('0x'):
                bytecode = '0x' + bytecode

        # 4. Deploy Gasless
        print("🚀 Broadcasting Sponsored Deployment...")
        invocation = await wallet.deploy_contract(
            bytecode=bytecode,
            args=["0xa97684ead0e45119da10d2ac23a5f0912a50f40d"],
            gasless=True
        )

        print("⏳ Waiting for confirmation...")
        await invocation.wait()
        print(f"\n🎉 SUCCESS! Engine Address: {invocation.contract_address}")

    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())
