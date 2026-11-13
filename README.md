
# 🔥 Ember Grid

### NASA Space Apps Challenge 2026
**Challenge: Harmonization of MODIS and VIIRS Hot Spots**

🌐 **Live Website:** [https://ember-grid.vercel.app/](https://ember-grid.vercel.app/)

---

## Project Overview

Ember Grid is a web-based platform designed to make satellite-based fire hotspot data easier to explore, compare, and understand. The project focuses on harmonizing active fire observations from NASA's MODIS and VIIRS instruments to support the exploration of historical fire activity and unusual patterns.

MODIS and VIIRS provide valuable satellite observations of active fire hotspots. However, the two instruments have different characteristics, including spatial resolution and observation patterns. Comparing their raw observations directly can therefore be challenging.

Ember Grid aims to provide a unified platform where users can explore original observations, view harmonized data, and examine fire activity across a selected area and time period.

## Key Features

- **Interactive Dashboard:** Explore fire activity using an Area of Interest (AOI), date range, satellite selection, and Raw or Harmonized data views.
- **Dashboard Overview:** View key statistics and visual summaries of fire activity.
- **Fire Calendar:** Explore daily and monthly historical fire activity.
- **Fire Alerts:** Review unusual fire activity and other detected events.
- **Fire Risk Analytics:** Examine historical activity patterns and trends.
- **Reports & Export:** Download available datasets, charts, and reports.
- **Methods & Provenance:** Learn about data sources, processing workflow, harmonization approach, and project references.
- **Email Subscription:** Subscribe to receive fire activity alerts.

## Data Sources

The project uses satellite-based active fire observations from **NASA FIRMS (Fire Information for Resource Management System)**, including:

- **MODIS** — Moderate Resolution Imaging Spectroradiometer.
- **VIIRS** — Visible Infrared Imaging Radiometer Suite.

For more information, visit [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/).

## Data Processing

The backend data-processing workflow uses **Python**, **NumPy**, and **Pandas** to process satellite observations.

The platform provides Raw and Harmonized data views so users can explore source observations alongside processed results. The processing and harmonization methodology is documented in the project's Methods & Provenance section.

## Technology Stack

### Web Application
- Next.js
- TypeScript
- Tailwind CSS

### Data Processing
- Python
- NumPy
- Pandas

## Team Members

| Name | Role |
|---|---|
| **A M Saadnan Tahsin** | Team Leader |
| **Shakhawat Hossain** | Web Developer |
| **Mst Rajia Akter Mitu** | Researcher |
| **S M Sajjad Hossain Shimanoto** | Data Analyst |
| **Habibur Rahman** | Video Editor |
| **Mohine Rana** | Science Strategist |

## Important Note

Satellite active fire detections are hotspot observations. They should not automatically be interpreted as confirmed wildfire boundaries or verified emergency incidents. Data availability, sensor characteristics, processing assumptions, and uncertainty should be considered when interpreting results.

## Acknowledgement

Developed as part of the **NASA Space Apps Challenge 2026**, in response to the challenge **"Harmonization of MODIS and VIIRS Hot Spots."**

We acknowledge NASA and the NASA FIRMS team for providing access to satellite-based active fire data and supporting resources.
