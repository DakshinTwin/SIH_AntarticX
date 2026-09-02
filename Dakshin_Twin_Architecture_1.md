**PRN-202501100006**

# System Architecture Document

**Project Name:** Dakshin-Twin (Antarctic Integrated Remote Intelligence & Knowledge System)
**SIH Problem Statement:** 26060

## 1. Technology Stack

### A. Frontend (NCPOR Operations Dashboard)
* **Framework:** React with TypeScript (Next.js App Router).
* **Styling:** Tailwind CSS (Light mode "Arctic Research Facility" theme).
* **Spatial Interface:** React Three Fiber (Three.js) for the interactive Bharati station container layout.
* **State Management & Data Fetching:** Zustand for UI state; Axios / Socket.io-client for real-time telemetry updates.

### B. Cloud Backend (Mainland / Goa Server)
* **Framework:** FastAPI (Python) - High-performance async processing for deeper intelligence.
* **Database:** PostgreSQL (with TimescaleDB for time-series telemetry).
* **Analytics Layer:** Python (`pandas`, `numpy`) for deterministic physics rules and cascading dependency calculations.

### C. Edge Node (Antarctic Station Local Server)
* **Ingestion:** Simulated MQTT streams for IoT sensor data.
* **Local Buffer:** SQLite to hold the local Digital Twin state during satellite outages.
* **Synchronization Service:** Python background worker managing the 4-Tier priority offline queue.
* **Selective AI:** Scikit-learn (Isolation Forest) running locally for mechanical anomaly detection on generator vibrations/temperatures.

## 2. 12-Entity Relational Data Schema
The core of the Operational State Graph relies on this strict, highly relational schema:
1. **Station:** `station_id, name, location, overall_risk, communication_state`
2. **Asset:** `asset_id, station_id, type, status, health_score` (e.g., Generator, Boiler, Heat-Trace Pipe)
3. **Sensor:** `sensor_id, asset_id, parameter, unit`
4. **Telemetry:** `timestamp, sensor_id, value, quality_flag`
5. **EnergySystem:** `generation, load, fuel_consumption, reserve, endurance`
6. **FuelTank:** `capacity, level, consumption_rate`
7. **InventoryItem:** `item_id, name, quantity, criticality, required_for`
8. **MaintenanceRecord:** `asset_id, event, date, status, required_parts`
9. **WeatherObservation:** `timestamp, temperature, wind, pressure, hazard_score`
10. **RiskEvent:** `event_id, severity, probability, affected_assets, status`
11. **Scenario:** `scenario_id, event, parameter_changes, predicted_effects` (Used exclusively by the What-If Engine)
12. **Recommendation:** `risk_event, reason, recommended_action, priority`

## 3. Distributed Architecture (LINK DOWN != SYSTEM DOWN)
To make operational continuity technically defensible during satellite blackouts, the system intelligence is explicitly divided into two domains:

### A. EDGE — Operational Continuity (Antarctic Station)
* **MQTT Ingestion:** Receives raw sensor data directly from station hardware.
* **Data Normalization:** Cleans, formats, and timestamps incoming streams locally.
* **SQLite Buffer:** Local storage ensuring continuous read/write capability without cloud access.
* **Local Digital Twin State:** Maintains the immediate physical reality and status of the station.
* **Anomaly Detection:** Scikit-learn (Isolation Forest) identifying mechanical deviations in real-time.
* **Critical Deterministic Rules:** Hardcoded physics and thresholds monitoring life-safety parameters.
* **Critical Risk Detection:** Flags immediate system failures (e.g., sudden generator shutdown).
* **Local Alerts:** Triggers on-site warnings for the wintering expedition team.
* **Offline Queue:** The 4-Tier priority sync engine buffering data for when satellite connectivity returns.

### B. NCPOR / GOA — Deeper Intelligence (Mainland Cloud)
* **Synchronized Twin Reconstruction:** Rebuilds the station state upon receiving the priority queue data.
* **Historical Analytics:** TimescaleDB processing long-term trends and resource burn rates.
* **Advanced Prediction:** Forecasting weather impacts and long-term fuel endurance.
* **Full Dependency Analysis:** Cascading risk propagation across the entire 12-entity graph.
* **What-If Simulation:** Branching the database state to test hypothetical operational scenarios.
* **Recommendation Aggregation:** Generating actionable, explainable decision support.
* **Operator Dashboard:** The Next.js Command Center UI for Goa personnel.

## 4. Folder & File Structure

```text
dakshin-twin/
│
├── frontend/                     # Next.js Application (Operator Dashboard)
│   ├── public/                   # Low-poly 3D models (.glb), SVGs
│   ├── src/
│   │   ├── components/           # UI cards, 3D Canvas, Charts
│   │   ├── store/                # Zustand UI State
│   │   └── api/                  # WebSocket connections
│
├── cloud-backend/                # FastAPI (Mainland Server - Deeper Intelligence)
│   ├── app/
│   │   ├── routers/              # Endpoints (Digital Twin, Scenarios)
│   │   ├── engine_risk/          # Calculates full dependency propagation
│   │   ├── engine_scenario/      # Clones database state for What-If tests
│   │   └── models/               # SQLAlchemy 12-entity models
│
└── edge-node/                    # Python Local Server (Edge - Operational Continuity)
    ├── ingestion/                # MQTT ingestion & data normalization
    ├── local_db/                 # SQLite Edge buffer & Local Twin State
    ├── anomaly_detector/         # Scikit-learn scripts & Critical Rules
    └── sync_manager/             # 4-Tier priority offline queue dispatcher
```

## 5. Reference: Bharati Station Physical Structure
Bharati's real steel structure integrates a total of **134 special containers**, integrated with an enveloping steel frame to transfer vertical and horizontal loads. Final structural analysis was performed by KSF GmbH & Co. KG (Bremerhaven); the investor of record is NCAOR (National Centre for Antarctic & Ocean Research), Goa, India. Source: Dlubal Software customer project reference — https://www.dlubal.com/en/downloads-and-information/references/customer-projects/000649
