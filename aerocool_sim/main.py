from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from web3 import Web3
import hashlib
import datetime

# ==========================================
# 1. MONGODB SETUP
# ==========================================
# Connects to your local MongoDB
MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.aerocool_db

# Mongoose automatically pluralizes collection names, so 'Telemetry' becomes 'telemetries'
collection = db.telemetries 

# ==========================================
# 2. GANACHE WEB3 SETUP (For critical breaches)
# ==========================================
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))

CONTRACT_ADDRESS = "0x0687BcB67Cd1A19cB3658C6f817011Ee41E61d39"
SENDER_ACCOUNT = w3.to_checksum_address("0x121f714bE8eaA58103e6Ef5cDeCDdA5324E91334")
PRIVATE_KEY = "0x8f8670b43f9a16d34678b029f119b6b797cdf9c62b39403ab3052bcac9db9bbc"
CONTRACT_ABI = '[{"inputs":[{"internalType":"string","name":"_deviceId","type":"string"},{"internalType":"string","name":"_temp","type":"string"}],"name":"logBreach","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

# ==========================================
# 3. FASTAPI SERVER INITIALIZATION
# ==========================================
app = FastAPI(title="AeroCool Command Center")

# ENABLE CORS (CRITICAL for React Dashboard to connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Payload coming from your Python Simulator
class TelemetryPayload(BaseModel):
    device_id: str
    temperature: float
    battery_level: float
    power_source: str
    fan_status: str
    alert_level: str

# ==========================================
# 4. BLOCKCHAIN LOGIC
# ==========================================
def mint_to_blockchain(device_id: str, temp: float):
    """Mints breach data to Ganache"""
    try:
        if w3.is_connected():
            contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
            tx = contract.functions.logBreach(device_id, str(temp)).build_transaction({
                'from': SENDER_ACCOUNT,
                'nonce': w3.eth.get_transaction_count(SENDER_ACCOUNT),
                'gas': 2000000,
                'gasPrice': w3.to_wei('50', 'gwei')
            })
            signed_tx = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
            
            # Use raw_transaction (Version 6 fix)
            tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
            print(f"🔗 [WEB3] BREACH MINTED! Tx Hash: {w3.to_hex(tx_hash)}")
    except Exception as e:
        print(f"⚠️ [WEB3 ERROR] Failed to mint: {e}")

# ==========================================
# 5. INCOMING DATA ROUTE (WRITE)
# ==========================================
@app.post("/api/telemetry")
async def receive_telemetry(data: TelemetryPayload, background_tasks: BackgroundTasks):
    
    # 1. Map data to match Teammate's exact Mongoose schema requirements
    mapped_power = "Solar" if "Solar" in data.power_source else "Battery"
    current_time = datetime.datetime.utcnow()
    
    # 2. Cryptographic Hashing (The Software Ledger)
    last_doc = await collection.find_one(sort=[("_id", -1)])
    previous_hash = last_doc["blockHash"] if last_doc and "blockHash" in last_doc else "0" * 64
    
    hash_string = f"{data.temperature}{data.battery_level}{mapped_power}{previous_hash}{current_time.timestamp()}"
    block_hash = hashlib.sha256(hash_string.encode()).hexdigest()

    # 3. Build the MongoDB Document
    mongo_document = {
        "temperature": data.temperature,
        "batteryLevel": data.battery_level,  
        "powerSource": mapped_power,         
        "previousHash": previous_hash,
        "blockHash": block_hash,
        "createdAt": current_time,           
        "updatedAt": current_time
    }

    # 4. Save to MongoDB
    await collection.insert_one(mongo_document)

    # 5. Routing Logic (Post-Save)
    if data.alert_level == "RED":
        print(f"🚨 [ALERT] Temp: {data.temperature}°C -> MongoDB Saved. Minting to Web3...")
        background_tasks.add_task(mint_to_blockchain, data.device_id, data.temperature)
        return {"status": "Breach Logged", "hash": block_hash, "web3": "Minting"}
    else:
        print(f"✅ [SAFE] Temp: {data.temperature}°C -> Saved to MongoDB.")
        return {"status": "Data Logged", "hash": block_hash}

# ==========================================
# 6. DASHBOARD ROUTES (READ)
# ==========================================
@app.get("/api/dashboard/history")
async def get_history():
    """Fetches the last 20 records from MongoDB for the React chart"""
    cursor = collection.find().sort("_id", -1).limit(20)
    history = await cursor.to_list(length=20)
    
    for item in history:
        item["_id"] = str(item["_id"])
        item["createdAt"] = item["createdAt"].isoformat()
        item["updatedAt"] = item["updatedAt"].isoformat()
    return history

@app.get("/api/dashboard/blockchain")
async def get_blockchain_breaches():
    """Calls the Ganache Smart Contract to get the immutable breach list"""
    try:
        contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
        total = contract.functions.getTotalBreaches().call()
        breaches = []
        
        for i in range(total):
            breach = contract.functions.breachHistory(i).call()
            breaches.append({
                "device_id": breach[0],
                "temperature": breach[1],
                "timestamp": breach[2]
            })
        
        return breaches[::-1] # Reverse so newest breaches are at the top
    except Exception as e:
        return {"error": str(e)}