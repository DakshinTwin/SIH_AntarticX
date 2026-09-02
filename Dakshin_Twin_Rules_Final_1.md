**PRN-202501100006**

# Development Rules & Boundaries

**Project Name:** Dakshin-Twin (Antarctic Integrated Remote Intelligence & Knowledge System)
**SIH Problem Statement:** 26060

## 1. Core Development Directives (What to Do)
* **Start at the Edge:** Build the `edge-node` (telemetry simulation and local SQLite buffer) first. The Cloud Backend cannot function without a realistic, intermittent data stream to process.
* **Hardcode the Physics:** The dependency graph should be built using explainable arithmetic and deterministic rules (e.g., `if temp < -30: heating_load_multiplier = 1.4`), not opaque machine learning models.
* **Label Simulated Data Explicitly:** Any simulated telemetry (generator output, fuel levels) must be clearly labeled as "Simulated" in the UI to maintain credibility with NCPOR judges. Real data (NPDC Weather APIs) should be explicitly labeled as "Live Public Data".
* **Prioritize the "What-If" Engine:** The Scenario Simulation Engine is the core differentiator. Ensure the backend can safely clone the current state of the 12-entity database without modifying live operational data.

## 2. Strict Anti-Patterns (What to Avoid)
* **No "Black-Box" AI:** Do not use Generative AI or LLMs to invent operational recommendations. Recommendations must be explainable outputs of the Risk Engine (e.g., "Recommend shifting load because Generator 1 is predicted to fail in 48 hours based on vibration anomalies").
* **No Remote Actuation Capabilities:** Do not build UI buttons that imply the mainland operator can physically shut off a generator or valve in Antarctica. The platform is for Decision Support, not remote autonomous control.
* **No Extraneous Dashboards:** Do not build standalone "Weather" or "Inventory" screens. All data must be viewed through the lens of the Digital Twin and how it impacts overall station operational risk.
* **Avoid Complex CAD/BIM Imports:** Do not attempt to render a massive, photorealistic .OBJ file of Maitri or Bharati in the browser. Use low-poly geometric representations (boxes/cylinders) in React Three Fiber to represent the 134-container layout of Bharati.

## 3. Approved Tech Stack & Libraries
* **Frontend:** React, Next.js, Tailwind CSS, React Three Fiber, Zustand.
* **Backend:** Python, FastAPI, SQLAlchemy.
* **Edge Node / Simulation:** Python, SQLite (for local buffering).
* **Data Science / Machine Learning:** Pandas, Scikit-learn (Isolation Forest for mechanical anomaly detection only).
* **Database:** PostgreSQL.

## 4. Error Handling & The "Antarctic Constraint"
* **Simulate Outages Gracefully:** The UI must handle sudden WebSocket disconnections gracefully. When the connection drops, the UI should lock into "Last Known State," display the timestamp of the last sync, and await priority-queued updates from the Edge Node.
* **Timeout Resilience:** If the cloud-based Risk Engine takes longer than 2 seconds to calculate a cascading failure, the UI should continue displaying live telemetry rather than hanging/freezing.

## 5. Scope Boundaries (Safety & Compliance)
* **Stick to the Current Stations:** The project scope is strictly limited to the *existing* Maitri and Bharati stations. Do not attempt to model or predict requirements for the upcoming Maitri-II replacement project.
* **Do Not Claim Real Telemetry Access:** Unless explicitly provided an API key by NCPOR during the hackathon, the team must state that the project framework is ready for BMS integration, but is currently running on simulated IoT telemetry.
