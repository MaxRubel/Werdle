import { useState, useEffect, useRef } from 'react';
import getNewWord from './api/word';

export default function WordGuess(props) {
  const [focusIndex, setFocusIndex] = useState(0);
  const [word, setWord] = useState('');
  const [indexMult, setIndexMult] = useState(0);
  const [playAgain, setPlayAgain] = useState(0);
  const guessNo = useRef(0);
  const gameStatus = useRef('playing');
  const { messageChild } = props;
  const { updateKey } = props;

  useEffect(() => {
    document.getElementById(focusIndex).select();
  }, [indexMult, focusIndex]);

  useEffect(() => {
    const newWord = getNewWord();
    setWord(newWord);
  }, []);

  const keyTopRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const keyMidRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const keyLastRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  if (guessNo.current === 6 && gameStatus.current === 'playing') {
    gameStatus.current = 'lost';
    setTimeout(() => {
      messageChild(`Good try! The word was "${word}"`);
    }, 2100);
  }
  if (gameStatus.current === 'won' || gameStatus.current === 'lost') {
    setTimeout(() => {
      setPlayAgain(1);
    }, 1800);
  }

  function compareWords(guess, word) {
    const exactPlacement = [];
    const approxPlacement = [];
    const displayArray = [];

    //GET GREEN/EXACT LETTERS
    for (let i = 0; i < 5; i++) {
      const char1 = guess[i];
      const char2 = word[i];
      const obj = {};
      if (char1 === char2) {
        exactPlacement.push(char1);
        obj.index = i;
        obj.style = 'green';
        displayArray.push(obj);
      } else {
        exactPlacement.push('');
      }
    }
    //GET YELLOW/NOT EXACT LETTERS
    for (let i = 0; i < 5; i++) {
      const char = guess[i];
      if (word.includes(char)) {
        approxPlacement.push(char);
      } else {
        approxPlacement.push('');
      }
    }
    //EXCLUDE YELLOW FROM GREEN POSITIONING
    for (let i = 0; i < 5; i++) {
      const char1 = approxPlacement[i];
      const char2 = exactPlacement[i];
      const obj = {};
      if (char1 !== char2 && char1) {
        obj.index = i;
        obj.style = 'yellow';
        displayArray.push(obj);
      }
    }
    // CREATE GREY ARRAY
    for (let i = 0; i < 5; i++) {
      const char1 = guess[i];
      const obj = {};
      if (!word.includes(char1)) {
        obj.index = i;
        obj.style = 'grey';
        displayArray.push(obj);
      }
    }
    //MAKE THE COLORS
    const sortArray = displayArray.sort((a, b) => a.index - b.index);
    sortArray.forEach((item, index) => {
      document.getElementById(item.index + indexMult).disabled = true;
      setTimeout(() => {
        document.getElementById(item.index + indexMult).style.backgroundColor =
          item.style;
        document.getElementById(item.index + indexMult).style.pointerEvents =
          'none';
      }, index * 400);
    });
    //CHECK FOR WINNER BY LOOPING THROUGH EXACT PLACEMENT ARRAY AND RETURNING 5 TRUES
    let winCounter = 0;
    exactPlacement.forEach((item) => {
      if (item) {
        winCounter++;
      }
      if (winCounter === 5) {
        for (let i = indexMult; i <= 29; i++)
          document.getElementById(i).disabled = true;
        setTimeout(() => {
          messageChild(`Nice job! You got the word!`);
          gameStatus.current = 'won';
        }, 2000);
      }
    });
    if (guessNo.current === 6 && gameStatus.current === 'playing') {
      gameStatus.current = 'lost';
    }
  }

  const handleInput = (index, e) => {
    const letter = document.getElementById(e.target.id).value;
    //IF A LETTER IS TYPED, MOVE FORWARD AN INPUT
    if (
      e.key !== 'Backspace' &&
      letter.length > 0 &&
      focusIndex < 4 + indexMult &&
      focusIndex < 29
    ) {
      setFocusIndex((prevState) => prevState + 1);
    }
    //IF BACKSPACE IS PRESSED, GO BACK AN INPUT
    else if (
      e.key === 'Backspace' &&
      letter.length === 0 &&
      focusIndex > 0 + indexMult
    ) {
      setFocusIndex((prevState) => prevState - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (gameStatus.current === 'playing') {
      let cond = true;
      const guess = [];
      for (let i = 0; i < 5; i++) {
        guess.push(document.getElementById(i + indexMult).value);
      }
      for (const letter of guess) {
        if (!letter) {
          cond = false;
        }
      }
      if (cond) {
        compareWords(guess, word);
        guessNo.current++;
        setIndexMult((prevState) => prevState + 5);
        if (focusIndex < 29) {
          setFocusIndex((prevState) => prevState + 1);
        }
      }
    } else {
      return;
    }
  };

  const handleClick = () => {
    updateKey();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className='wordle-container'>
          <div className='line'>
            {Array.from({ length: 5 }, (_, index) => (
              <input
                key={index}
                id={index}
                className='letter-box'
                type='text'
                maxLength={1}
                onKeyDown={(e) => handleInput(index, e)}
                onClick={() => {
                  setFocusIndex(index);
                }}
              />
            ))}
          </div>
        </div>
        <button type='submit' style={{ display: 'none' }}></button>
      </form>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className='wordle-container'>
          <div className='line'>
            {Array.from({ length: 5 }, (_, index) => (
              <input
                key={index + 5}
                id={index + 5}
                className='letter-box'
                type='text'
                maxLength={1}
                onKeyDown={(e) => handleInput(index, e)}
                onClick={() => {
                  setFocusIndex(index);
                }}
              />
            ))}
          </div>
        </div>
        <button type='submit' style={{ display: 'none' }}></button>
      </form>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className='wordle-container'>
          <div className='line'>
            {Array.from({ length: 5 }, (_, index) => (
              <input
                key={index + 10}
                id={index + 10}
                className='letter-box'
                type='text'
                maxLength={1}
                onKeyDown={(e) => handleInput(index, e)}
                onClick={() => {
                  setFocusIndex(index);
                }}
              />
            ))}
          </div>
        </div>
        <button type='submit' style={{ display: 'none' }}></button>
      </form>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className='wordle-container'>
          <div className='line'>
            {Array.from({ length: 5 }, (_, index) => (
              <input
                key={index + 15}
                id={index + 15}
                className='letter-box'
                type='text'
                maxLength={1}
                onKeyDown={(e) => handleInput(index, e)}
                onClick={() => {
                  setFocusIndex(index);
                }}
              />
            ))}
          </div>
        </div>
        <button type='submit' style={{ display: 'none' }}></button>
      </form>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className='wordle-container'>
          <div className='line'>
            {Array.from({ length: 5 }, (_, index) => (
              <input
                key={index + 20}
                id={index + 20}
                className='letter-box'
                type='text'
                maxLength={1}
                onKeyDown={(e) => handleInput(index, e)}
                onClick={() => {
                  setFocusIndex(index);
                }}
              />
            ))}
          </div>
        </div>
        <button type='submit' style={{ display: 'none' }}></button>
      </form>
      <form
        id='lastRow'
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className='wordle-container'>
          <div className='line'>
            {Array.from({ length: 5 }, (_, index) => (
              <input
                key={index + 25}
                id={index + 25}
                className='letter-box'
                type='text'
                maxLength={1}
                onKeyDown={(e) => handleInput(index, e)}
                onClick={() => {
                  setFocusIndex(index);
                }}
              />
            ))}
          </div>
        </div>
        <button type='submit' style={{ display: 'none' }}></button>
      </form>
      {playAgain === 1 && (
        <button
          type='button'
          style={{ marginTop: '3%' }}
          onClick={handleClick}
          className='btn btn-success'
        >
          Click Here to Play Again
        </button>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'center', // Align items to the start of the container
          gap: '2%', // Add some space between items
          marginTop: '3%',
          width: '500px', // Set the width to 100% to fill its pa
        }}
      >
        {keyTopRow.map((item, index) => (
          <button key={index} id={item} type='button' className='btn btn-light'>
            {item}
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center', // Align items to the start of the container
          gap: '2%', // Add some space between items
          marginTop: '3%',
          width: '500px', // Set the width to 100% to fill its pa
        }}
      >
        {keyMidRow.map((item, index) => (
          <button
            key={index + 11}
            id={item}
            type='button'
            className='btn btn-light'
          >
            {item}
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center', // Align items to the start of the container
          gap: '2%', // Add some space between items
          marginTop: '3%',
          width: '500px', // Set the width to 100% to fill its pa
        }}
      >
        {keyLastRow.map((item, index) => (
          <button
            key={index + 10}
            id={item}
            type='button'
            className='btn btn-light'
          >
            {item}
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center', // Align items to the start of the container
          gap: '2%', // Add some space between items
          marginTop: '3%',
          width: '500px', // Set the width to 100% to fill its pa
        }}
      >
        <button id='Enter' type='button' className='btn btn-light'>
          RETURN
        </button>
      </div>
    </div>
  );
}
