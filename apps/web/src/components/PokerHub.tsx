import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Card {
  suit: '♠' | '♣' | '♥' | '♦';
  value: string;
  rank: number;
}

const SUITS: ('♠' | '♣' | '♥' | '♦')[] = ['♠', '♣', '♥', '♦'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const PokerHub: React.FC = () => {
  const [hand, setHand] = useState<Card[]>([]);
  const [isDealing, setIsDealing] = useState(false);
  const [chips, setChips] = useState(1000);
  const [bet, setBet] = useState(10);
  const [gameState, setGameState] = useState<'idle' | 'dealt' | 'result'>('idle');
  const [message, setMessage] = useState('PLACE YOUR BET');

  const createDeck = () => {
    const deck: Card[] = [];
    SUITS.forEach(suit => {
      VALUES.forEach((value, index) => {
        deck.push({ suit, value, rank: index + 2 });
      });
    });
    return deck.sort(() => Math.random() - 0.5);
  };

  const dealHand = async () => {
    if (chips < bet) return;
    
    setIsDealing(true);
    setChips(prev => prev - bet);
    setGameState('dealt');
    setMessage('DEALING...');
    
    const deck = createDeck();
    const newHand = deck.slice(0, 5);
    
    // Animate dealing
    setHand([]);
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setHand(prev => [...prev, newHand[i]]);
    }
    
    evaluateHand(newHand);
    setIsDealing(false);
    setGameState('result');
  };

  const evaluateHand = (currentHand: Card[]) => {
    const ranks = currentHand.map(c => c.rank).sort((a, b) => a - b);
    const suits = currentHand.map(c => c.suit);
    
    const isFlush = new Set(suits).size === 1;
    const isStraight = ranks.every((r, i) => i === 0 || r === ranks[i - 1] + 1);
    
    const counts: Record<number, number> = {};
    ranks.forEach(r => counts[r] = (counts[r] || 0) + 1);
    const duplicates = Object.values(counts).sort((a, b) => b - a);
    
    let payout = 0;
    let handName = 'HIGH CARD';
    
    if (isFlush && isStraight) {
      payout = bet * 50;
      handName = 'STRAIGHT FLUSH';
    } else if (duplicates[0] === 4) {
      payout = bet * 25;
      handName = 'FOUR OF A KIND';
    } else if (duplicates[0] === 3 && duplicates[1] === 2) {
      payout = bet * 15;
      handName = 'FULL HOUSE';
    } else if (isFlush) {
      payout = bet * 10;
      handName = 'FLUSH';
    } else if (isStraight) {
      payout = bet * 5;
      handName = 'STRAIGHT';
    } else if (duplicates[0] === 3) {
      payout = bet * 3;
      handName = 'THREE OF A KIND';
    } else if (duplicates[0] === 2 && duplicates[1] === 2) {
      payout = bet * 2;
      handName = 'TWO PAIR';
    } else if (duplicates[0] === 2) {
      payout = bet * 1;
      handName = 'PAIR';
    }
    
    if (payout > 0) {
      setChips(prev => prev + payout);
      setMessage(`🎉 ${handName}! +$${payout}`);
    } else {
      setMessage('LUCK NEXT TIME');
    }
  };

  return (
    <div className="poker-game glass-panel">
      <div className="poker-header">
        <h3 className="game-title">VIDEO POKER</h3>
        <div className="poker-chips">💰 {chips}</div>
      </div>

      <div className="poker-table">
        <div className="poker-cards">
          <AnimatePresence>
            {hand.map((card, index) => (
              <motion.div
                key={`${card.suit}-${card.value}-${index}`}
                className={`poker-card ${card.suit === '♥' || card.suit === '♦' ? 'red' : 'black'}`}
                initial={{ rotateY: 180, opacity: 0, scale: 0.5 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="card-value">{card.value}</div>
                <div className="card-suit">{card.suit}</div>
              </motion.div>
            ))}
            {hand.length === 0 && Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="card-back" />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="poker-controls">
        <div className="poker-message">{message}</div>
        
        <div className="bet-controls">
          <button 
            className="bet-btn" 
            onClick={() => setBet(Math.max(10, bet - 10))}
            disabled={gameState === 'dealt' || isDealing}
          >
            -
          </button>
          <div className="current-bet">BET: ${bet}</div>
          <button 
            className="bet-btn" 
            onClick={() => setBet(bet + 10)}
            disabled={gameState === 'dealt' || isDealing}
          >
            +
          </button>
        </div>

        <button 
          className="deal-btn"
          onClick={dealHand}
          disabled={isDealing || chips < bet}
        >
          {gameState === 'idle' ? 'DEAL' : 'PLAY AGAIN'}
        </button>
      </div>

      <style>{`
        .poker-game {
          padding: 2rem;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }
        .poker-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .game-title {
          font-family: var(--cyber-font);
          color: var(--neon-cyan);
          margin: 0;
        }
        .poker-chips {
          font-family: var(--tech-font);
          font-size: 1.2rem;
          color: var(--quantum-gold);
        }
        .poker-table {
          height: 180px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          perspective: 1000px;
        }
        .poker-cards {
          display: flex;
          gap: 10px;
        }
        .poker-card, .card-back {
          width: 80px;
          height: 120px;
          background: white;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: black;
          font-weight: bold;
          font-size: 1.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        }
        .card-back {
          background: linear-gradient(135deg, var(--neon-purple), var(--neon-pink));
          border: 2px solid white;
        }
        .poker-card.red { color: #ff0000; }
        .poker-card.black { color: #000000; }
        .poker-controls {
          text-align: center;
        }
        .poker-message {
          font-family: var(--tech-font);
          color: var(--neon-cyan);
          margin-bottom: 1rem;
          height: 1.5rem;
        }
        .deal-btn {
          width: 100%;
          padding: 1rem;
          background: var(--hologram-gradient);
          border: none;
          border-radius: 10px;
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }
        .deal-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 20px var(--neon-cyan);
        }
        .deal-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .bet-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .bet-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid var(--neon-cyan);
          background: transparent;
          color: var(--neon-cyan);
          cursor: pointer;
        }
        .current-bet {
          font-family: var(--tech-font);
          color: white;
        }
      `}</style>
    </div>
  );
};
