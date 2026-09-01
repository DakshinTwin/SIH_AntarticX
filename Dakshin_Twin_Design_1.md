**PRN-202501100006**

# Design & UI/UX Guidelines

**Project Name:** Dakshin-Twin
**SIH Problem Statement:** 26060

## 1. Overall Theme: "Arctic Research Facility"
Moving away from a dark-mode bunker, this UI reflects a modern, sterile, and highly efficient scientific research environment. The interface leverages a light, breathable aesthetic that uses subtle blue tints to evoke the Antarctic environment (ice, water, sky), while maintaining strict high-contrast readability for operational data.

* **Light & Sterile Base:** Uses white and light grey to create a clean canvas.
* **Iceberg Accents:** Uses `#BCE1F4` to highlight active zones, selected menus, and structural backgrounds.
* **High-Contrast Data:** Uses charcoal grey (`#2D3436`) for all primary text to ensure readability against the light backgrounds without the harshness of pure black.

## 2. Color Palette

### A. Primary & Analogous Colors (The "Iceberg" Spectrum)
* **Primary Accent:** `Iceberg Blue` (#BCE1F4) - Used for primary buttons, active states, and highlighting healthy 3D structural assets.
* **Analogous 1 (Cooler):** `Glacier Cyan` (#AEE4E5) - Used for secondary data visualizations and charts.
* **Analogous 2 (Deeper):** `Frost Periwinkle` (#B5CBF0) - Used for subtle gradients or secondary highlights.

### B. Backgrounds & Surfaces (Secondary Colors)
* **Main App Background:** `White` (#FFFFFF) - The core canvas of the dashboard.
* **Panels & Cards:** `Light Grey` (#F8F9FA or Tailwind `gray-50`) - Used to separate dashboard widgets (e.g., Risk Engine panel, Scenario Panel) from the white background.
* **Subtle Borders:** `#E5E7EB` (Tailwind `gray-200`) - For dividing lines between data points.

### C. Text & Deep Accents
* **Primary Text & High-Contrast Elements:** `Charcoal` (#2D3436) - Used for all main headings, body text, and icons. Provides excellent accessibility and contrast.
* **Muted Text:** `#6B7280` (Tailwind `gray-500`) - Used for timestamps, units of measurement, and secondary labels.

### D. Risk Engine Status Colors (Tuned for Light Backgrounds)
* **Normal (Healthy):** `#10B981` (Emerald Green)
* **Warning (Degraded):** `#F59E0B` (Amber)
* **High Risk / Critical:** `#EF4444` (Rose/Red)
* **Simulation Mode:** `#8B5CF6` (Vivid Purple) - Colors the UI borders when the operator is running a "What-If" scenario to prevent confusion with live data.

## 3. Typography & Font Pairing

The project utilizes a strict **3-tier font pairing** concept to separate headings, readable prose, and jitter-free numerical data.

### A. Headings & UI Labels (Font 1)
* **Font Family:** `Montserrat` (Google Fonts)
* **Usage:** Used for the dashboard title (Dakshin-Twin), widget headers (e.g., "Dependency Graph", "Risk Engine"), and primary navigation buttons. Its geometric, slightly wide structure gives a modern, engineered feel.
* **Styling:** Bold (`700`) or Semi-Bold (`600`), colored in `#2D3436`.

### B. Body Text & General UI (Font 2)
* **Font Family:** `Inter` or `Roboto` (Google Fonts)
* **Usage:** Used for longer text, such as recommendation outputs (e.g., "Review non-critical heating loads"). Highly readable at small sizes.

### C. Telemetry & Live Data (Font 3)
* **Font Family:** `JetBrains Mono` or `Fira Code`
* **Usage:** Monospace fonts are **mandatory** for all raw numbers, timestamps, and sensor readings (e.g., `84.2 kW`, `14:02:55`). Because every character has the same width, fast-updating telemetry will not cause the UI to jitter horizontally.

## 4. UI Component Styling
* **Shadows:** Because the theme is light (White/Light Grey), use soft, diffuse drop-shadows (Tailwind `shadow-md` or `shadow-lg`) to lift panels and cards off the canvas and establish hierarchy.
* **Corners:** `rounded-lg` (8px border radius) for panels and buttons. Keeps the interface looking like modern software rather than a legacy industrial tool.
* **3D Canvas (React Three Fiber):** The 3D view of the station should sit on a soft `#BCE1F4` to white radial gradient background, making the structural blocks of the Digital Twin stand out clearly.

## 5. Layout Structure
1. **Top Navigation Bar:** White background, `#2D3436` text. Station selector (Bharati / Maitri), Global Risk Score, and Connection Status (Live/Offline).
2. **Left Panel (Spatial):** The interactive 3D Digital Twin visualizer. For the MVP, this renders Bharati's low-poly container layout; Maitri is selectable in the data model but not spatially modeled in the hackathon build.
3. **Center Panel (Dependencies):** The Dependency Chain visualizer connecting domains (Weather → Heating → Power → Logistics).
4. **Right Panel (Details & Actions):** Contextual data for clicked assets, the What-If simulation toggle, and Risk Engine recommendations.
