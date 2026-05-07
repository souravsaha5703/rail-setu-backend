# 🚂 RailSetu
### AI-Powered Multi-Hop Transit Optimizer for Indian Railways

---

## 📖 Overview

**RailSetu** solves the "No Direct Availability" problem in Indian Railways. When all direct trains between a source and destination are waitlisted, RAC, or in regret status, RailSetu uses a **Smart Route Breaking System** combined with **Gemini AI reasoning** to find the best intermediate junction stations — allowing users to complete their journey in two connecting legs with confirmed seats.

> Built as a Final Semester Major Project demonstrating full-stack development, NoSQL data engineering, and practical AI integration.

---

## 🚨 The Problem

During peak seasons and holidays, direct trains between major hubs are often:
- Stuck in **long waitlists** with low confirmation chances
- In **REGRET** status — no more bookings allowed
- In **RAC** with uncertain confirmation

Users are forced to manually search for junction stations, check two separate trains, and validate timings — a time-consuming and error-prone process.

---

## ✅ The Solution

RailSetu automates this entire process:

1. **Detects** when all direct trains are unavailable
2. **Analyses** train schedules stored in MongoDB to find intermediate junction stations
3. **Uses Gemini AI** to recommend the top 2 best junction stations based on connectivity and practicality
4. **Checks seat availability** for both legs of each suggested connection
5. **Displays** results in a clean Split-Card UI

---

## ⚙️ Features

- 🔍 **Direct Train Search** — Search trains between any two stations with real-time seat availability
- 🚉 **Station Search** — Instant search across 10,102 Indian Railway stations loaded on app startup
- 📅 **Schedule Viewer** — View complete train schedules with smart DB caching
- 🤖 **Smart Route** — AI-powered multi-hop journey suggestions when direct trains are unavailable
- ⚡ **Intelligent Caching** — Node-cache for session data, MongoDB for persistent schedule storage
- 🧠 **Gemini AI Integration** — Gemini 3 Flash Preview ranks junction stations based on connectivity and practicality

---

## 🏗️ Architecture

```
App Startup
        ↓
Load 10,102 Indian Railway stations → Send to Frontend
        ↓
User searches Source → Destination + Date
        ↓
External API → Fetch Trains + Seat Availability
        ↓
Cache train numbers in Node-Cache (30 min TTL)
        ↓
Display results to user
        ↓
All trains Waitlisted / RAC / Regret?
        ↓
User clicks "Smart Route"
        ↓
Seed train schedules into MongoDB (if not already stored)
        ↓
Query MongoDB:
  Leg 1 → All trains passing through SOURCE
  Leg 2 → All trains passing through DESTINATION
        ↓
Extract unique intermediate stations from each leg
        ↓
Send to Gemini AI → Get Top 2 Junction Recommendations
        ↓
Check seat availability for each junction pair
        ↓
Display Split-Card UI with both legs
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend API** | Node.js + Express.js |
| **Database** | MongoDB with Mongoose |
| **AI Model** | Google Gemini 3 Flash Preview (`@google/genai`) |
| **Caching** | Node-Cache (in-memory, 30 min TTL) |
| **Station Data** | Static JSON — 10,102 Indian Railway stations |
| **External APIs** | RailRadar API (schedules), RapidAPI IRCTC (availability) |

---

## 📁 Project Structure

```
RailSetu/
├── config/
│   ├── cache.js                      # Shared Node-cache instance
│   └── db.js                         # MongoDB connection
├── controllers/
│   ├── getBetweenTrains.js           # Direct train search + availability
│   ├── getTrainSchedule.js           # Train schedule fetch + cache
│   ├── smartRouteController.js       # Smart route orchestration
│   └── stationsController.js         # Station list delivery to frontend
├── data/
│   └── stations.json                 # 10,102 Indian Railway stations
├── models/
│   └── trainRoute.js                 # Mongoose TrainRoute schema
├── routes/
│   ├── index.js                      # Route aggregator
│   ├── stations.js                   # Station routes
│   └── trains.js                     # Train + smart route routes
├── services/
│   ├── fetchAndCacheSchedule.js      # Fetch + store individual schedule
│   ├── findLegRoutes.js              # Leg1 + Leg2 extraction from MongoDB
│   ├── getAIRecommendation.js        # Gemini AI junction recommendation
│   ├── getSmartRouteAvailability.js  # Availability check for each junction pair
│   └── seedSchedulesForSmartRoute.js # Bulk schedule seeding
├── utils/
│   └── dateConverter.js              # Date format conversion
├── .env
└── app.js
```

---

## 🗄️ Database Schema

```javascript
// TrainRoute Model
{
  train: {
    number: String,                 // unique train number
    name: String,
    type: String,
    sourceStationCode: String,
    destinationStationCode: String
  },
  route: [
    {
      sequence: Number,
      stationCode: String,
      stationName: String,
      arrivalMinutes: Number,       // minutes from midnight
      departureMinutes: Number,     // minutes from midnight
      day: Number,                  // journey day (1, 2, 3...)
      distanceFromSourceKm: Number,
      isHalt: Boolean
    }
  ],
  timestamps: true
}
```

> **Time Format:** `arrivalMinutes` and `departureMinutes` store time as minutes from midnight. For multi-day journeys, the `day` field tracks the journey day. Absolute time = `(day - 1) * 1440 + minutes`.

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API Key
- RailRadar API Key
- RapidAPI IRCTC API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/railsetu.git
cd railsetu

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
RAIL_API_KEY=your_railradar_api_key
IRCTC_API_KEY=your_rapidapi_irctc_key
```

### Run The Server

```bash
# Development
npm run dev

# Production
npm start
```

---

## 📡 API Endpoints

### Station Search
```
GET /api/stations
```
Returns all 10,102 Indian Railway stations. Called once on frontend startup for instant station search.

### Train Search
```
GET /api/trains/between?source=HWH&destination=JAT&date=31-05-2026
```
Returns all trains between source and destination with real-time seat availability. Also caches train numbers in Node-Cache for Smart Route use.

### Train Schedule
```
GET /api/trains/schedule?trainNo=12810&date=13-05-2026
```
Returns full schedule for a train. Serves from MongoDB if already cached, otherwise fetches from RailRadar API, stores in MongoDB, then returns.

### Smart Route
```
GET /api/trains/smart-connect?sourceCode=HWH&destCode=JAT&date=31-05-2026
```
Returns AI-recommended junction stations with seat availability for both legs.

**Sample Response:**
```json
{
  "success": true,
  "message": "Smart Route Ready",
  "data": [
    {
      "rank": 1,
      "stationCode": "CNB",
      "stationName": "Kanpur Ctrl",
      "leg1": {
        "from": { "code": "HWH", "name": "Howrah Jn" },
        "to": { "code": "CNB", "name": "Kanpur Ctrl" },
        "data": { "trains": ["..."] }
      },
      "leg2": {
        "from": { "code": "CNB", "name": "Kanpur Ctrl" },
        "to": { "code": "NDLS", "name": "New Delhi" },
        "data": { "trains": ["..."] }
      }
    }
  ]
}
```

---

## 🤖 Smart Route — How It Works

### Step 1: Schedule Seeding
When a user searches trains, their train numbers are cached in Node-Cache (key: `SOURCE-DESTINATION-DATE`, TTL: 30 min). When Smart Route is triggered, schedules for all cached trains are fetched from RailRadar API and stored in MongoDB if not already present.

### Step 2: Leg Extraction
```
Leg 1 — Query MongoDB for all trains whose route contains SOURCE
         Extract all unique stations AFTER source

Leg 2 — Query MongoDB for all trains whose route contains DESTINATION
         Extract all unique stations BEFORE destination
```

### Step 3: Gemini AI Recommendation
Unique station lists from both legs are sent to **Gemini 3 Flash Preview** which:
- Finds common stations between Leg 1 and Leg 2 station lists
- Ranks them by connectivity and junction importance
- Avoids late-night transfers (midnight to 5AM)
- Returns top 3 junction candidates with full source/destination pair info

### Step 4: Availability Check
Seat availability is checked in parallel for each recommended junction:
- `Source → Junction` (Leg 1 availability)
- `Junction → Destination` (Leg 2 availability)

---

## 🔮 Future Scope

- **Live Delay Integration** — Adjust connection suggestions based on real-time train delays
- **Fare Estimation** — Combined fare calculation for both journey legs
- **Redis Caching** — Persistent cache that survives server restarts
- **Offline Mode** — Cache common junction points for searches without internet
- **PNR Status Tracking** — Track both legs of a split journey from one screen

---

## 👨‍💻 About

Built with ❤️ as a Final Semester Major Project.

This project demonstrates:
- **Complex Data Handling** — Solving connected path problems in NoSQL
- **AI Utility** — Using LLMs for logical decision-making beyond simple chatbots
- **Full-Stack Competence** — Clean separation across controllers, services, and models
- **Smart Caching** — Multi-layer caching strategy for performance and API efficiency
- **Real-World Problem Solving** — Addressing a genuine pain point for millions of Indian Railway passengers

---

## 📄 License

This project is licensed under the MIT License.