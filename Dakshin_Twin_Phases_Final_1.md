**PRN-202501100006**

# Project Implementation Phases

**Project Name:** Dakshin-Twin (Antarctic Integrated Remote Intelligence & Knowledge System)
**SIH Problem Statement:** 26060

## Phase 1: Edge Simulation & 12-Entity Schema (Weeks 1-2)
*Goal: Build the data foundation and the simulated Antarctic environment.*
* **Database Setup:** Initialize PostgreSQL for the Cloud Backend and SQLite for the Edge Node. Implement the strict 12-entity relational schema (Station, Asset, Sensor, Telemetry, EnergySystem, FuelTank, etc.).
* **Telemetry Generator:** Write Python scripts to simulate Bharati's generators (temperature, vibration, load) and fuel tanks.
* **Public Data Integration:** Connect to the NPDC API or use historical CSV datasets to pull real Antarctic weather observations (temperature, wind speed).
* **Local Ingestion:** Ensure the simulated Edge Node successfully receives and normalizes both the simulated hardware telemetry and the real weather data.

## Phase 2: The Dependency & Risk Engine (Weeks 3-4)
*Goal: Transform raw data into the Operational State Graph.*
* **Hardcode the Physics:** Write the backend Python logic that connects domains. (e.g., Calculate how a 20% drop in external temperature increases the thermal heating load by X%, thereby increasing generator fuel consumption).
* **Anomaly Detection:** Implement a basic scikit-learn Isolation Forest on the simulated generator vibration data to flag "Warnings".
* **Risk Scoring Algorithm:** Build the function that calculates overall risk using the formula: `Probability x Severity x Dependency Impact x Resource Availability`.

## Phase 3: Offline Synchronization Protocol (Weeks 5-6)
*Goal: Prove the architecture is Antarctic-specific by handling satellite outages.*
* **4-Tier Priority Queue:** Implement the local Edge buffer. Classify events into Priority 1 (Critical), 2 (High), 3 (Normal), and 4 (Bulk).
* **Outage Simulation:** Create a manual "Kill Switch" in the backend to simulate a satellite connection drop.
* **Reconnection Logic:** Write the sync manager that pushes Priority 1 and 2 events to the Cloud Backend immediately upon reconnection, before pushing bulk telemetry.

## Phase 4: Spatial UI & Command Dashboard (Weeks 7-8)
*Goal: Visualize the Digital Twin state without overwhelming the browser.*
* **Dashboard Scaffolding:** Build the Next.js frontend with Tailwind CSS. Create the Global Overview and Event/Risk Detail panels.
* **React Three Fiber (3D):** Create a low-poly representation of Bharati Station (using 134 modular container blocks).
* **State Binding:** Connect the UI to the Cloud Backend via WebSockets. Ensure the 3D assets change color (e.g., green to red) when the Risk Engine flags a dependency failure.
* **Data Freshness Indicators:** Implement clear UI badges showing "Live", "Delayed", "Offline", and "Simulated".

## Phase 5: "What-If" Engine & SIH Demo Polish (Weeks 9-10)
*Goal: Finalize the decision-support simulation and rehearse the pitch.*
* **Scenario Branching:** Build the backend endpoint that clones the current 12-entity database state into a temporary "Scenario" table to project hypothetical outcomes.
* **UI Integration:** Add the "Simulate" button to the frontend, allowing judges to see the predicted outcome of a generator failure without altering the live dashboard.
* **Script the Demo:** Hardcode the 5-minute SIH pitch scenario: Weather deterioration -> Energy impact -> Predicted generator anomaly -> Spare part shortage -> Communication outage -> Synchronized recovery.
