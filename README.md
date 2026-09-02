# DAKSHIN-Twin — Antarctic Station Operations Intelligence

**Smart India Hackathon 2026**  
**Problem Statement:** 26060 — *Develop a Digital Twin framework for Maitri and Bharati stations integrating infrastructure, energy, logistics and environmental monitoring for efficient remote management.*  
**Target Organization:** MoES / NCPOR (National Centre for Polar and Ocean Research, Goa)  
**Theme:** Smart Automation  
**Primary Users:** NCPOR Remote Operations Personnel (Goa) & Station Engineers / Leadership (Antarctica)

---

## ❄️ Overview

**DAKSHIN-Twin** is an edge-first Digital Twin and Station Operations Intelligence platform designed specifically for India's Antarctic research stations—**Bharati** (Larsemann Hills) and **Maitri** (Schirmacher Oasis).

### Core Innovation: Cross-Domain Dependency Intelligence
Traditional monitoring treats weather, power, heating, fuel, and logistics as isolated silos. DAKSHIN-Twin connects all domains into a unified operational state:

```
WEATHER (Temp / Wind / Visibility)
  ↓
HEATING DEMAND (Thermal load)
  ↓
POWER DEMAND (Electrical load)
  ↓
GENERATOR LOAD & REDUNDANCY (Gen 1 / Gen 2)
  ↓
FUEL CONSUMPTION & ENDURANCE (L/hr & Days)
  ↓
OPERATIONAL MARGIN & RECOVERY LOGISTICS (Spares / Water)
  ↓
COMPOSITE STATION RISK (0–100 Explainable Score)
```

### Second Core Innovation: Edge-First Offline Resilience
In Antarctica, satellite communication (VSAT/Iridium) regularly drops due to solar storms, blizzard masking, or satellite geometry.

> **Core Axiom:** *LINK DOWN ≠ SYSTEM DOWN*

When the satellite link goes offline:
1. **Local Digital Twin calculations continue uninterrupted.**
2. **Deterministic Risk Engine continues assessing operational margin.**
3. **What-If Simulations remain fully operable on-station.**
4. **Events are buffered in a prioritized offline queue:**
   - **P1 (Critical):** Safety events, generator/power failures
   - **P2 (High):** Major operational state transitions & heating alerts
   - **P3 (Normal):** Periodic aggregated telemetry
   - **P4 (Bulk):** Historical & raw data batches
5. **On reconnection**, priority-driven delta synchronization restores mainland visibility at NCPOR Goa.

---

## 🧭 Application Structure

1. **[ OVERVIEW ]**: High-level NCPOR mainland control view showing station cards, cross-station risk score, critical alert counters, and operational summaries.
2. **[ BHARATI ]**: Dedicated station view featuring station profile, environment, power generation, fuel reserves, heating, water/inventory, 2D station schematic, and SVG dependency chain.
3. **[ MAITRI ]**: Dedicated station view for Maitri station with distinct baseline values, Schirmacher Oasis profile, and independent live state telemetry.
4. **[ COMBINED OPERATIONS ]**: NCPOR / Goa operations command view with non-averaged combined risk logic, multi-station risk driver explanations, and mainland-to-station network topology.
5. **[ WHAT-IF SIMULATOR ]**: Interactive parameter-driven simulation engine with 7 realistic scenario presets, live vs. projected telemetry comparisons, deterministic dependency propagation, offline queuing, and priority delta synchronization.

---

## 🚀 Running the Application Locally

### Prerequisites
- Node.js v18+ or v20+
- npm or pnpm

### Quick Start
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
http://localhost:3000
```

---

## 🧪 SIH Demo Script (Step-by-Step)

1. **Step 1 — Global Overview:**  
   Open `OVERVIEW`. Highlight Bharati (Low Risk) and Maitri (Moderate Risk). Point out the `SIMULATED PROTOTYPE` badges and explain that public weather and simulated telemetry drive realistic operational models.
2. **Step 2 — Station Deep Dive:**  
   Navigate to `BHARATI`. Review station profile (134 container modules, 2×125 kW generators), 2D station schematic, and live dependency chain.
3. **Step 3 — Launch What-If Simulator:**  
   Go to `WHAT-IF`. Verify that the top badge shows `LIVE STATE UNCHANGED`.
4. **Step 4 — Trigger Compound Emergency:**  
   Click the preset `COMPOUND ANTARCTIC EMERGENCY` (or set Temp = -42°C, Wind = 85 km/h, Gen 2 = FAILED, Fuel = 38%, Spare = LOW, Comms = OFFLINE).
5. **Step 5 — Explain Cross-Domain Propagation:**  
   Walk judges through the live recalculation:
   - Weather Severity $\rightarrow$ **HIGH/EXTREME**
   - Heating Demand jumps to **~85-92%**
   - Generator 1 takes entire load (**~80-95%**) due to Gen 2 failure
   - Power Margin shrinks from **+31%** to **critical deficit**
   - Fuel Consumption increases to **~18-22 L/hr**, dropping endurance
   - Overall Risk escalates to **CRITICAL (76–90/100)**
6. **Step 6 — Live vs. Projected Comparison:**  
   Inspect the side-by-side comparison table highlighting every modified parameter.
7. **Step 7 — Offline Resilience & Sync Queue:**  
   Show the **COMMUNICATION LOST** banner. Emphasize that edge calculations continue locally. Review the **P1 $\rightarrow$ P4 Offline Sync Queue**.
8. **Step 8 — Reconnection & Delta Sync:**  
   Click **RESTORE CONNECTION**. Observe the animated priority sync ($P1 \rightarrow P2 \rightarrow P3 \rightarrow P4$) and watch NCPOR Goa's mainland state update upon completion.

---

## 🎨 Design Philosophy
- **Light Antarctic / Scientific Aesthetic:** Arctic Ice Blue (`#BCE1F4`), Glacier Cyan (`#AEE4E5`), Frost Periwinkle (`#B5CBF0`), Clean White (`#FFFFFF`), Off-White Panels (`#F8F9FA`).
- **Typography:** *Montserrat* (Headers), *Inter* (UI/Body), *JetBrains Mono* (Telemetry/Values).
- **Honest Data Disclosure:** Clear labeling of simulated telemetry and advisory-only recommendations without implying remote equipment actuation.
