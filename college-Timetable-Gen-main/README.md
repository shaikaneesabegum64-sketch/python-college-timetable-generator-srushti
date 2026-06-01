# GeniTable | Advanced College Timetable Generator

A modern, high-performance academic scheduling application featuring a stunning web interface and a robust Python backend.

![UI Preview](https://via.placeholder.com/1200x600/0a0a0c/ffffff?text=GeniTable+Modern+Dashboard)

## ✨ Features

- **Stunning UI**: Premium dark-mode dashboard with glassmorphism and smooth animations.
- **Dynamic Generation**: Automatically generate optimized weekly schedules.
- **Faculty Management**: Track workloads, specializations, and manage teacher distribution.
- **Quick Replacement**: Instantly find and assign available teachers for any period.
- **Export to PDF**: Generate and download professional PDF versions of your timetable.
- **Configuration**: Easily manage subjects and faculty specializations via the Settings tab.

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Framer Motion, Lucide React, HTML2Canvas, jsPDF.
- **Backend**: Python, FastAPI, Uvicorn.
- **Persistence**: JSON-based local storage.

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+

### Setup

1. **Install Python Dependencies**:
   ```bash
   pip install fastapi uvicorn
   ```

2. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Run the Application**:
   - Start the Backend:
     ```bash
     python api.py
     ```
   - Start the Frontend:
     ```bash
     cd frontend
     npm run dev
     ```

4. **Access the UI**:
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

## 📜 License
MIT License.
