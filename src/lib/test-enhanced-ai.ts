import { Chess } from 'chess.js';
import { EnhancedChessAI } from './enhanced-chess-ai';

// Test function for the enhanced AI system
export async function testEnhancedAI() {
  console.log('🧪 Testing Enhanced AI System...');
  
  const game = new Chess();
  const ai = new EnhancedChessAI('master');
  
  try {
    // Test basic move generation
    console.log('📊 Testing move generation...');
    const move = await ai.getMove(game);
    
    if (move) {
      console.log('✅ Move generated successfully:', move);
      console.log('🎯 AI Sources:', ai.getAISources());
      console.log('💭 Thinking message:', ai.getThinkingMessage());
    } else {
      console.log('❌ No move generated');
    }
    
    // Test with a more complex position
    console.log('📊 Testing complex position...');
    game.move('e4');
    game.move('e5');
    game.move('Nf3');
    
    const complexMove = await ai.getMove(game);
    if (complexMove) {
      console.log('✅ Complex move generated:', complexMove);
    } else {
      console.log('❌ No complex move generated');
    }
    
    console.log('🎉 Enhanced AI test completed successfully!');
    
  } catch (error) {
    console.error('❌ Enhanced AI test failed:', error);
  }
}

// Export for use in development
export { EnhancedChessAI }; 