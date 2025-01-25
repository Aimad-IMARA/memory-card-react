import React, { useState, useEffect } from "react";
import "./App.css";

const initialCards = [
  { id: 1, name: "cherry", flipped: false, matched: false },
  { id: 2, name: "corn", flipped: false, matched: false },
  { id: 3, name: "cherry", flipped: false, matched: false },
  { id: 4, name: "corn", flipped: false, matched: false },
];

const shuffleCards = (cards) => {
  return [...cards]
    .sort(() => Math.random() - 0.5)
    .map((card) => ({ ...card, flipped: false, matched: false }));
};

function App() {
  const [cards, setCards] = useState(shuffleCards(initialCards));
  const [selectedCards, setSelectedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isGameRunning) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isGameRunning]);

  const handleCardClick = (index) => {
    if (
      selectedCards.length === 2 ||
      cards[index].flipped ||
      cards[index].matched
    ) {
      return;
    }

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setSelectedCards((prev) => [...prev, index]);

    if (selectedCards.length === 1) {
      setMoves((prev) => prev + 1);
      const [firstIndex] = selectedCards;
      const secondIndex = index;

      if (cards[firstIndex].name === cards[secondIndex].name) {
        // Cards match
        setTimeout(() => {
          newCards[firstIndex].matched = true;
          newCards[secondIndex].matched = true;
          setCards(newCards);
          setSelectedCards([]);
        }, 500);
      } else {
        // Cards don't match
        setTimeout(() => {
          newCards[firstIndex].flipped = false;
          newCards[secondIndex].flipped = false;
          setCards(newCards);
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  const handleStart = () => {
    setCards(shuffleCards(initialCards));
    setMoves(0);
    setTime(0);
    setIsGameRunning(true);
  };

  return (
    <div className="app">
      <div className="header">
        <button onClick={handleStart}>Start</button>
        <div>
          Moves: {moves} | Time: {time}s
        </div>
      </div>
      <div className="game-board">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card ${card.flipped ? "flipped" : ""} ${
              card.matched ? "matched" : ""
            }`}
            onClick={() => handleCardClick(index)}
          >
            {card.flipped || card.matched ? <span>{card.name}</span> : ""}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
