# AeroCool OS ❄️

**AeroCool OS** is an intelligent software command center designed for the Smart Active Cold Chain Box. It ensures the integrity of life-saving medical supplies during transit by combining real-time IoT monitoring with a **Hybrid Web3 Architecture** for immutable data logging.

Developed during the **Quantxera 2K26 Hackathon**, placing **4th out of 40+ teams**.

## 🎯 What This Project Does

AeroCool OS transforms traditional medical logistics into a proactive, zero-trust system:

* **Real-time IoT Telemetry**: Monitors internal temperature ($2-8^{\circ}C$), battery lifecycle, and solar power status.
* **Hybrid Web3 Logging**: Routine data is stored in a standard database to save costs, while critical thermal breaches are permanently minted onto the **Ethereum Blockchain** via **Solidity Smart Contracts**.
* **Proactive Excursion Alerts**: Instantly triggers **Twilio SMS** alerts to supervisors if a temperature spike is detected.
* **Edge Caching**: Implements local caching for 4G dead zones, ensuring zero data gaps by bulk-syncing once connectivity is restored.

## 🏗️ Project Architecture

```text
AeroCool-OS/
├── aerocool_sim/         # Python IoT Edge Simulator
│   └── simulator.py      # Generates temp/battery/solar telemetry
├── aerocool-ui/          # React Frontend (Supervisor Dashboard)
│   └── src/components/   # Live charts and status widgets
├── backend/              # Node.js & FastAPI Hybrid Backend
│   ├── app.js            # Node/Express logic
│   └── main.py           # FastAPI Web3/Blockchain integration
├── config/               # Database and API configurations
├── models/               # MongoDB/PostgreSQL schemas
└── contracts/            # Solidity Smart Contracts
```

## 🛠️ Technical Stack

* **Frontend**: React, TailwindCSS, Recharts.
* **Backend**: Node.js, Express, Python FastAPI.
* **Database**: MongoDB.
* **Web3**: Solidity, Web3.py, Ganache/Ethereum.
* **Integrations**: Twilio API for GSM alerts.

## 🚀 How to Run the Application

### Prerequisites
* **Python 3.8+**
* **Node.js 16+ & npm**
* **Ganache** (For local blockchain testing)

### 1. Backend Setup (FastAPI & Node)
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt
npm install

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup (React)
```bash
# Navigate to UI directory
cd aerocool-ui

# Install dependencies
npm install

# Start the dashboard
npm start
```

### 3. IoT Simulator
```bash
# Start the telemetry simulation
python aerocool_sim/simulator.py
```

## 🌍 SDG Alignment

* **SDG 3 (Good Health)**: Guaranteeing safe delivery of vaccines to improve health service efficiency.
* **SDG 7 (Clean Energy)**: Actively monitoring and promoting solar power usage for remote cooling.

---

Would you like me to help you refine the **Technical Setup** section with the specific environment variables needed for your Twilio and Ganache integration?
