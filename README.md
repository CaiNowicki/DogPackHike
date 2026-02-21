# 🐾 Dog Pack Calculator

A conservative, safety-first hiking load calculator for dogs.

**Dog Pack Calculator** helps determine an appropriate pack weight for a hiking dog based on body weight, age, fitness level, terrain, distance, elevation gain, and temperature. It also provides water-only equivalents and built-in safety guidance.

The app is fully offline and does not require an account, backend, or internet connection.

---

## 🚀 Features

### 📊 Smart Pack Weight Calculation

* Fitness-based baseline ranges
* Age-aware adjustments (puppy and senior handling)
* Size-class life stage thresholds
* Terrain, elevation, distance, and heat adjustments
* Hard cap at **20% of body weight**
* Safe range + recommended target weight
* Transparent calculation breakdown

### 💧 Water-Only Equivalents

Convert target pack weight to:

* Gallons / fl oz (US)
* Liters / mL (Metric)

Clearly labeled as:

> Equivalent if the load were entirely water.

### 🐶 Dog Profiles

* Save dog profiles locally
* Select a saved dog and skip re-entering details
* Units stored per profile (US or Metric)
* Fully offline persistence via AsyncStorage

### 📋 Safety Guidance

* Built-in hiking checklist
* Heat warnings
* Senior adjustments
* Conservative calculation logic

### ❤️ Support Page

* “Tip the developer” screen
* App sharing option
* Transparent notice about future optional paid upgrades

---

## 🧮 Calculation Model

The calculator starts with conservative baseline ranges:

| Fitness Level | Range  |
| ------------- | ------ |
| Low           | 8–10%  |
| Average       | 10–14% |
| High          | 12–16% |

Adjustments are applied for:

* Pack experience
* Puppy (<1.5 years)
* Senior (size-based thresholds)
* Distance (>8 mi, >12 mi)
* Terrain (mixed, rugged)
* Elevation (>1500 ft, >3000 ft)
* Temperature (≥75°F, ≥85°F)

Final results are:

* Clamped to never drop below 0%
* Hard capped at **20% body weight**

This is intentionally conservative and prioritizes safety.

---

## 📱 Screens

### Calculator

* Select saved dog OR enter dog details
* Enter hike conditions
* Calculate safe pack range

### Results

* Target pack weight (large display)
* Safe min–max range
* Water-only equivalent
* Warnings & breakdown
* Hiking checklist

### Profiles

* Create, select, and delete saved dogs
* Persisted locally

### Support

* Share the app
* View upcoming planned features

---

## 🏗 Tech Stack

* **Expo (Managed Workflow)**
* **Expo Router**
* **React Native (TypeScript)**
* **AsyncStorage (local persistence)**
* Fully offline, no backend

---

## 📦 Project Structure

```
app/
  _layout.tsx
  index.tsx
  results.tsx
  profiles.tsx
  tip.tsx

lib/
  calc.ts
  units.ts
  storage.ts
  models.ts
  keys.ts
```

---

## 🛠 Development

### Install dependencies

```bash
npx expo install @react-native-async-storage/async-storage
```

### Run locally

```bash
npx expo start
```

Scan with Expo Go or run in an Android emulator.

---

## 🚧 Planned Future Features

The app is currently free.

Planned optional paid upgrades may include:

* Unlimited dog profiles
* Saved favorite hikes
* Export/shareable result cards
* Expanded trip planning tools

No in-app purchases are implemented at this time.

---

## ⚠️ Disclaimer

This app provides estimates only and does not replace veterinary advice.

Always:

* Start with lighter loads
* Increase gradually
* Monitor for fatigue or overheating
* Stop immediately if your dog shows distress

