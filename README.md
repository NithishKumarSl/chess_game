# Chess Master - Enhanced AI Chess Game

A modern, feature-rich chess application built with Next.js, React, and TypeScript. Features a **dual AI system** that combines custom algorithms with Gemini 2.5 Flash AI for enhanced gameplay.

## 🚀 Features

### **Dual AI System**
- **Custom Algorithm**: Advanced minimax with alpha-beta pruning
- **Gemini 2.5 Flash**: Google's latest AI for strategic analysis

### **Game Features**
- ✅ Real-time chess gameplay
- ✅ Multiple AI difficulty levels (Novice, Intermediate, Master)
- ✅ Time controls (Unlimited, Blitz, Rapid, Classical, Custom)
- ✅ Move history with timestamps
- ✅ Visual move highlighting and square selection
- ✅ Game result detection (Checkmate, Stalemate, Draw, Timeout)
- ✅ Undo functionality
- ✅ Responsive design with mobile support

### **Advanced AI Capabilities**
- 🧠 **Confidence-based move selection** from multiple AI sources
- 🎯 **Adaptive difficulty** based on available engines
- ⚡ **Parallel engine analysis** for optimal performance
- 🔄 **Graceful fallback** if engines are unavailable
- 📊 **Real-time AI status** indicators

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Chess Engine**: chess.js, react-chessboard
- **AI Engines**: Custom Algorithm, Gemini 2.5 Flash
- **Styling**: Tailwind CSS, Lucide React icons
- **Animations**: Framer Motion

## 🎯 AI Difficulty Levels

### **Novice Level**
- Learning-friendly gameplay
- 60% best moves, 40% random selection
- Perfect for beginners

### **Intermediate Level**
- Competitive club-level play
- 80% best moves, 20% from top 3
- Challenging for experienced players

### **Master Level**
- Grandmaster-level analysis
- Always selects the strongest move
- Uses all available AI engines

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd chess
npm install
```

### 2. Configure AI (Optional)
Create a `.env.local` file:
```env
# Get your API key from: https://makersuite.google.com/app/apikey
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open Browser
Navigate to `http://localhost:3000`

## 🔧 AI Setup Guide

For detailed AI configuration instructions, see [AI_SETUP.md](./AI_SETUP.md).

### **Required for Full AI Experience**
1. **Gemini API Key**: For Gemini 2.5 Flash AI
2. **Custom Algorithm**: Always available

## 🎮 How to Play

1. **Start Game**: Click "BEGIN BATTLE" on the intro page
2. **Configure Settings**: Choose your color, AI difficulty, and time control
3. **Make Moves**: Click and drag pieces or click squares to move
4. **Track Progress**: View move history and game statistics
5. **Analyze**: Watch AI engines work in real-time

## 🏆 AI Engine Details

### **Custom Algorithm**
- Advanced minimax with alpha-beta pruning
- Position evaluation with piece-square tables
- Opening book for realistic early game play
- **Confidence**: 0.3

### **Gemini 2.5 Flash**
- Google's latest AI model
- Strategic understanding and positional play
- Natural language chess reasoning
- **Confidence**: 0.9

## 🎯 Performance

### **With Both Engines**
- **Novice**: Beatable by beginners
- **Intermediate**: Challenging for club players  
- **Master**: Strong strategic play

### **With Custom Algorithm Only**
- **Novice**: Good for learning
- **Intermediate**: Solid tactical play
- **Master**: Strong positional understanding

## 🔧 Development

### **Project Structure**
```
src/
├── app/                 # Next.js app router
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # AI engines and utilities
│   ├── enhanced-chess-ai.ts    # Triple AI system
│   ├── chess-ai.ts             # Original algorithm
│   └── game-utils.ts           # Game utilities
└── types/              # TypeScript definitions
```

### **Key Components**
- `ChessGame.tsx`: Main game component with AI integration
- `EnhancedChessAI`: Triple AI system implementation
- `GameSettings.tsx`: Configuration interface
- `useChessGame.ts`: Game state management

## 🛠️ Troubleshooting

### **AI Not Working**
- Check browser console for errors
- Verify API keys in `.env.local`
- Ensure internet connection for Gemini AI

### **Performance Issues**
- Reduce AI timeout in environment variables
- Disable engines in environment variables
- Check browser compatibility

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🎉 Acknowledgments

- **chess.js**: Chess game logic
- **react-chessboard**: Chess UI component
- **Google Gemini**: AI analysis
- **Tailwind CSS**: Styling framework

---

**Ready to challenge the ultimate AI chess opponent? Start playing now! ♟️**
