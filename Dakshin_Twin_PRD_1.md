**PRN-202501100006**

# Product Requirements Document (PRD)

**Project Name:** Dakshin-Twin (Antarctic Integrated Remote Intelligence & Knowledge System)
**SIH Problem Statement:** 26060
**Organization:** Ministry of Earth Sciences (MoES) / NCPOR
**Theme:** Smart Automation

## 1. Product Overview (The "What" and "Why")
Dakshin-Twin is an edge-first Station Operations Intelligence Platform designed for India's Antarctic research stations (Maitri and Bharati). It transcends traditional isolated dashboards by functioning as a unified **Operational State Graph**.

The system continuously combines station telemetry, weather, energy, infrastructure, and logistics data to detect problems, predict their consequences through physical dependency chains, simulate "what-if" scenarios, and recommend explainable actions to NCPOR operators. It specifically addresses the realities of Antarctic isolation, ensuring the station's "brain" continues to operate locally during satellite communication outages.

## 2. Target Users
* **Primary:** NCPOR remote operations personnel in Goa (Mainland Commanders) needing station-wide visibility, alerts, forecasts, and decision support.
* **Secondary:** Station Leaders / Engineers (On-Site) needing local operational information, diagnostic context, and scenario analysis without relying on mainland connectivity.

## 3. Core Features & Functional Requirements

### A. Hybrid Edge Digital Twin & Spatial Interface
* **Interactive Visualization:** A spatial interface (2.5D or simplified 3D using basic geometries) acting as a visual overlay for the operational state.
* **Contextual Data:** Clicking an asset (e.g., Generator 2) reveals its current state, dependencies, risk level, and predicted issues.
* **Edge-First Architecture:** The core logic runs locally at the station. If satellite connection drops, the station continues processing anomalies locally.

### B. Dependency & Risk Engine
* **Cascading Risk Logic:** The system must evaluate how a failure in one domain affects others.
    * *Example:* High Wind (Environment) -> Increased Heating Demand (Infrastructure) -> Elevated CHP Load (Energy) -> Accelerated Depletion (Logistics).
* **Explainable Risk Scoring:** Combines Probability x Severity x Dependency Impact x Resource Availability to generate a final risk score (Normal, Warning, High Risk, Critical).

### C. "What-If" Simulation Engine
* **Scenario Branching:** Operators can clone the current station state to test hypothetical events (e.g., "Simulate Generator 1 failure").
* **Predictive Outcomes:** The engine calculates downstream effects (power reduction, heating impact, fuel endurance changes) without affecting the actual live dashboard.

### D. 4-Tier Offline Synchronization
* **Prioritized Queuing:** During communication outages, telemetry is buffered locally. Upon reconnection, data is synced based on priority:
    1. **Critical:** Safety events, equipment failures.
    2. **High:** Major state transitions.
    3. **Normal:** Aggregated telemetry.
    4. **Bulk:** Raw historical data.

### E. Selective AI & Decision Support
* **Advisory Only:** Recommends highest-value operational responses (e.g., "Prioritize maintenance intervention"); never assumes autonomous control of life-critical systems.
* **Targeted ML:** Utilizes specific algorithms (e.g., Isolation Forests, run at the Edge) for vibration/temperature anomaly detection, and statistical models for weather impact, avoiding opaque/generic chatbots.

## 4. MVP Scope (Hackathon Execution)
To ensure the project is highly impactful yet practically achievable, the MVP will focus on:
* **Primary Station:** Bharati (utilizing its modular 134-container layout for the spatial UI). Bharati's steel envelope integrates 134 special containers to transfer vertical and horizontal loads [1]. Maitri remains in scope architecturally (12-entity schema supports multi-station data) but is not part of the hackathon demo build.
* **Data Strategy:** Integrating real NPDC public weather APIs while using a Python-based simulation script to generate mock equipment telemetry.
* **Logic Layer:** Building the Dependency Engine using straightforward programmatic rules (Python) rather than complex graph databases.
* **Demo Focus:** A single, flawless demonstration scenario (e.g., Weather deterioration -> Generator anomaly -> Spare part shortage -> Offline Sync).

---

**[1]** Dlubal Software, "Customer Project: 'Bharati' Research Station in Antarctica" — structural reference confirming the station's steel structure integrates 134 special containers, with final structural analysis by KSF (Bremerhaven) and investor NCAOR (Goa, India). https://www.dlubal.com/en/downloads-and-information/references/customer-projects/000649
