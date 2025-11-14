#!/bin/bash
# Quick start script for the Metaverse platform

echo "=========================================="
echo "🌟 METAVERSE PLATFORM LAUNCHER 🌟"
echo "=========================================="
echo ""
echo "What would you like to run?"
echo ""
echo "  1. Interactive Demo (Command Line)"
echo "  2. Core Simulation (Python Demo)"
echo "  3. API Server (REST API)"
echo "  4. 3D Web Interface (Browser)"
echo "  5. Install Dependencies"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🎮 Starting Interactive Demo..."
        python3 demo.py
        ;;
    2)
        echo ""
        echo "⚙️ Running Core Simulation..."
        python3 metaverse_core.py
        ;;
    3)
        echo ""
        echo "🚀 Starting API Server..."
        echo "API will be available at http://localhost:5000"
        python3 metaverse_api.py
        ;;
    4)
        echo ""
        echo "🌐 Opening 3D Web Interface..."
        if command -v xdg-open > /dev/null; then
            xdg-open metaverse_3d_renderer.html
        elif command -v open > /dev/null; then
            open metaverse_3d_renderer.html
        else
            echo "Please open metaverse_3d_renderer.html in your browser"
        fi
        ;;
    5)
        echo ""
        echo "📦 Installing dependencies..."
        pip3 install -r requirements.txt
        echo ""
        echo "✅ Dependencies installed!"
        ;;
    *)
        echo "Invalid choice!"
        exit 1
        ;;
esac
