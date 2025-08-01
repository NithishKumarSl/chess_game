# Enhanced AI Chess Setup Guide

This chess game now features a **dual AI system** that combines a custom algorithm with Gemini 2.5 Flash AI for enhanced gameplay.

## 🚀 AI Components

### 1. **Custom Algorithm** (Always Available)
- Advanced minimax algorithm with alpha-beta pruning
- Position evaluation with piece-square tables
- Opening book for realistic early game play

### 2. **Gemini 2.5 Flash AI** (Optional)
- Google's latest AI model for chess analysis
- Strategic understanding and positional play
- Natural language chess reasoning

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Google Gemini API Key (Required for Gemini AI)
# Get your API key from: https://makersuite.google.com/app/apikey
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Configure AI behavior
NEXT_PUBLIC_AI_TIMEOUT=5000
NEXT_PUBLIC_GEMINI_ENABLED=true
```

### 3. Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env.local` file

## 🎯 AI Difficulty Levels

### **Novice Level**
- **Custom Algorithm**: 70% random moves, 30% basic evaluation
- **Gemini**: Basic strategic guidance
- **Overall**: 60% chance to pick best move, 40% random selection

### **Intermediate Level**
- **Custom Algorithm**: 40% random, 60% minimax with depth 2
- **Gemini**: Tactical awareness
- **Overall**: 80% chance to pick best move, 20% from top 3

### **Master Level**
- **Custom Algorithm**: 10% random, 90% advanced minimax with alpha-beta pruning
- **Gemini**: Deep strategic analysis
- **Overall**: Always picks the strongest move

## 🔍 How It Works

The AI system uses a **confidence-based selection algorithm**:

1. **Collects moves** from all available AI sources
2. **Assigns confidence scores**:
   - Custom Algorithm: 0.3
   - Gemini AI: 0.9
3. **Selects the best move** based on difficulty level
4. **Falls back gracefully** if engines are unavailable

## 🎮 Features

### **Real-time AI Analysis**
- Shows which AI engines are active
- Displays thinking messages from each engine
- Visual indicators for AI sources

### **Adaptive Difficulty**
- Automatically adjusts based on available engines
- Maintains consistent challenge level
- Graceful degradation if engines fail

### **Performance Optimized**
- Parallel engine analysis
- Timeout protection (5 seconds per engine)
- Efficient move selection

## 🛠️ Troubleshooting

### **Gemini AI Not Working**
- Check your API key in `.env.local`
- Ensure you have sufficient API quota
- Verify internet connection

### **Quota Exceeded Error**
The free tier of Gemini API has limits:
- **50 requests per day**
- **15 requests per minute**
- Quota resets daily at midnight UTC

**Solutions:**
1. **Wait for quota reset** (shown in console)
2. **Use custom algorithm only** (automatically falls back)
3. **Upgrade to paid plan** for higher limits
4. **Use different API key** if available

### **Performance Issues**
- Reduce AI timeout in environment variables
- Disable engines in environment variables
- Check browser console for errors

## 🎯 Expected Performance

### **With Both Engines**
- **Novice**: Beatable by beginners
- **Intermediate**: Challenging for club players
- **Master**: Strong strategic play

### **With Custom Algorithm Only**
- **Novice**: Good for learning
- **Intermediate**: Solid tactical play
- **Master**: Strong positional understanding

## 🔧 Advanced Configuration

### **Customize AI Behavior**
```env
# Adjust AI timeout (milliseconds)
NEXT_PUBLIC_AI_TIMEOUT=3000

# Enable/disable specific engines
NEXT_PUBLIC_GEMINI_ENABLED=true
```

### **Modify Confidence Scores**
Edit `src/lib/enhanced-chess-ai.ts` to adjust confidence scores for different engines.

## 🎉 Ready to Play!

Once configured, the AI will automatically use the best available engines to provide the most challenging and realistic chess experience possible.

**Happy playing! ♟️** 