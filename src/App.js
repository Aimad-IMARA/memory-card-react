import React, { useState, useEffect } from "react";
import "./App.css";

import chicken from "./assets/chicken.png";
import dog from "./assets/dog.png";
import cow from "./assets/cow.png";
import messi from "./assets/messi.png";
import lion from "./assets/lion.png";
import tiger from "./assets/tiger.png";
import fox from "./assets/fox.png";
import wolf from "./assets/wolf.png";

const generateCards = (size) => {
  const images = [chicken, dog, cow, messi, lion, tiger, fox, wolf];
  const cardImages = [
    ...images.slice(0, size / 2),
    ...images.slice(0, size / 2),
  ];
  const shuffledImages = cardImages.sort(() => Math.random() - 0.5);

  return shuffledImages.map((imageUrl, id) => ({
    id,
    imageUrl,
    flipped: false,
    matched: false,
  }));
};

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [cardMode, setCardMode] = useState(4);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState([]);
  const [showWinMessage, setShowWinMessage] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(
    "linear-gradient(135deg, #2c3e50, #4ca1af)"
  );

  useEffect(() => {
    setCards(generateCards(cardMode));
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setIsPlaying(false);
    setShowWinMessage(false);
  }, [cardMode]);

  const saveGameToHistory = () => {
    const newGame = {
      mode: cardMode,
      moves,
      time,
    };
    const updatedHistory = [...history, newGame];
    setHistory(updatedHistory);
    localStorage.setItem("memoryGameHistory", JSON.stringify(updatedHistory));
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched)) {
      setIsPlaying(false);
      saveGameToHistory();
      setShowWinMessage(true);
    }
  }, [cards]);

  useEffect(() => {
    document.body.style.background = backgroundColor;
  }, [backgroundColor]);

  const handleCardClick = (id) => {
    if (flippedCards.length === 2 || cards[id].flipped || cards[id].matched)
      return;

    const updatedCards = cards.map((card) =>
      card.id === id ? { ...card, flipped: true } : card
    );
    const updatedFlipped = [...flippedCards, id];

    setCards(updatedCards);
    setFlippedCards(updatedFlipped);

    if (updatedFlipped.length === 2) {
      setMoves((prev) => prev + 2);
      const [first, second] = updatedFlipped;
      if (cards[first].imageUrl === cards[second].imageUrl) {
        setCards((prev) =>
          prev.map((card) =>
            card.id === first || card.id === second
              ? { ...card, matched: true }
              : card
          )
        );
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, flipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }

    if (!isPlaying) setIsPlaying(true);
  };

  const resetGame = () => {
    setCards(generateCards(cardMode));
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setIsPlaying(false);
    setShowWinMessage(false);
  };

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("memoryGameHistory")) || [];
    setHistory(savedHistory);
  }, []);

  return (
    <div className="App">
      <div className="header">
        <div className="stats">
          <p>Moves: {moves}</p>
          <p>Time: {time}s</p>
          <p>
            <label>Background :</label>
            <select
              onChange={(e) => setBackgroundColor(e.target.value)}
              value={backgroundColor}
            >
              <option value="linear-gradient(135deg, #2c3e50, #4ca1af)">
                Default
              </option>
              <option value="linear-gradient(135deg, #ff7e5f, #feb47b)">
                Sunset
              </option>
              <option value="linear-gradient(135deg, #6a11cb, #2575fc)">
                Ocean
              </option>
            </select>
          </p>
          <p>
            <label>Mode: </label>
            <select
              value={cardMode}
              onChange={(e) => setCardMode(Number(e.target.value))}
            >
              <option value={4}>4 Cards</option>
              <option value={8}>8 Cards</option>
              <option value={16}>16 Cards</option>
            </select>
          </p>
        </div>
        <div className="settings">
          <button onClick={resetGame}>Restart</button>
          <button onClick={() => setShowHistory(!showHistory)}>History</button>
        </div>
      </div>

      <div className="container">
        <div
          className="card-grid"
          style={{
            gridTemplateColumns: `repeat(${Math.sqrt(cardMode)}, 1fr)`,
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className={`card ${
                card.flipped || card.matched ? "flipped" : ""
              }`}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="card-inner">
                <div className="card-front"></div>
                <div className="card-back">
                  <img src={card.imageUrl} alt="card" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showHistory && (
        <div className="history-popup">
          <div className="history-content">
            <h2>Game History</h2>
            {history.length === 0 ? (
              <p>No games played yet.</p>
            ) : (
              <ul>
                {history.map((game, index) => (
                  <li key={index}>
                    Mode: {game.mode}, Moves: {game.moves}, Time: {game.time}s.
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setShowHistory(false)}>Close</button>
          </div>
        </div>
      )}
      {showWinMessage && (
        <div className="win-message-popup">
          <div className="win-message-content">
            <h2>
              YOU WON! With {moves} moves under {time} seconds.
            </h2>
            <button onClick={resetGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
