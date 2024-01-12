import { useState, useEffect, useRef } from 'react';
import getNewWord from './api/word';
import arrayBusiness from './utils/arrayBusiness';

export default function WordGuess(props) {
  const [focusIndex, setFocusIndex] = useState(0);
  const [word, setWord] = useState('');
  const [indexMult, setIndexMult] = useState(0);
  const [playAgain, setPlayAgain] = useState(0);
  const [message, setMessage] = useState('')
  const guessNo = useRef(0);
  const gameStatus = useRef('playing');
  const focusRef = useRef(0)

  const { updateKey } = props;

  useEffect(() => {
    document.getElementById(focusIndex).select();
    console.log('focus index', focusIndex)
  }, [indexMult, focusIndex]);

  useEffect(() => {
    const newWord = getNewWord();
    setWord(newWord);
  }, []);

  window.addEventListener('click', () => {
    document.getElementById(focusIndex).select()
  })

  const keyTopRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Backspace'];
  const keyMidRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const keyLastRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  if (guessNo.current === 6 && gameStatus.current === 'playing') {
    gameStatus.current = 'lost';
    setTimeout(() => {
      setMessage(`Good try! The word was "${word}"`);
    }, 2000);
  }
  if (gameStatus.current === 'won' || gameStatus.current === 'lost') {
    setTimeout(() => {
      setPlayAgain(1);
    }, 2500);
  }

  function compareWords(guess, word) {
    const { displayArray, exactPlacement } = arrayBusiness(guess, word)
    //RESULTS OF ARRAY----------^
    displayArray.forEach((letter) => {
      setTimeout(() => {
        document.getElementById(letter.letter).style.backgroundColor = letter.style
      }, 2000)
    })
    //MAKE THE COLORS-----------v
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
    //CHECK FOR WINNER 
    // BY LOOPING THROUGH EXACT PLACEMENT ARRAY AND RETURNING 5 TRUES
    let winCounter = 0;
    exactPlacement.forEach((item) => {
      if (item) {
        winCounter++;
      }
      if (winCounter === 5) {
        for (let i = indexMult; i <= 29; i++)
          document.getElementById(i).disabled = true;
        setTimeout(() => {
          setMessage(`Nice job! You got the word!`);
          gameStatus.current = 'won';
        }, 2000);
      }
    });
    if (guessNo.current === 6 && gameStatus.current === 'playing') {
      gameStatus.current = 'lost';
    }
  }
  // ---------------------game logic^
  //---------------event-handlers---v
  const handleInput = (e) => {
    const letter = document.getElementById(e.target.id).value;
    let timeoutId;

    // change colors during typing
    if (keyTopRow.includes(e.key.toUpperCase()) || keyMidRow.includes(e.key.toUpperCase()) || keyLastRow.includes(e.key.toUpperCase()) || e.key === 'Enter') {
      // Cancel the previous timeout if it exists
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Change the color of the input temporarily
      document.getElementById(e.key).style.backgroundColor = 'lightgrey'

      // Set a new timeout
      timeoutId = setTimeout(() => {
        // Revert the color of the input back to its original color
        document.getElementById(e.key).style = '';
      }, 400);
    }

    // LETTER TYPED -- increment focusIndex
    if (
      e.key !== 'Backspace' &&
      letter.length > 0 &&
      focusIndex < 4 + indexMult &&
      focusIndex < 29
    ) {
      setFocusIndex((prevState) => prevState + 1);
    }
    //BACKSPACE --- decrement focusIndex
    else if (
      e.key === 'Backspace' &&
      letter.length === 0 &&
      focusIndex > 0 + indexMult
    ) {
      setFocusIndex((prevState) => prevState - 1);
    }
  };
  // --letter clicked (from on screen keyboard)
  const keyClick = (e) => {
    //LETTER CLICKS
    if (
      e.target.id !== 'backspace' &&
      e.target.id !== 'Enter' &&
      focusIndex <= 4 + indexMult &&
      focusIndex < 29
    ) {
      document.getElementById(focusIndex).value = e.target.id
      if (focusIndex !== 4 + indexMult) setFocusIndex((prevState) => prevState + 1);
    }
    //BACKSPACE 
    if (
      e.target.id === 'backspace' &&
      focusIndex >= 0 + indexMult
    ) {
      if (focusIndex < 4 + indexMult && focusIndex > 0 + indexMult && document.getElementById(focusIndex).value === '') {
        document.getElementById(focusIndex - 1).value = ''
        setFocusIndex((prevState) => prevState - 1);
      }
      if (focusIndex < 4 + indexMult && focusIndex > 0 + indexMult && document.getElementById(focusIndex).value) {
        document.getElementById(focusIndex).value = ''
        if (focusIndex !== 0 + indexMult) { setFocusIndex((prevState) => prevState - 1); }
      }
      if (focusIndex === 0 + indexMult && document.getElementById(focusIndex)) {
        document.getElementById(focusIndex).value = ''
      }
      if (focusIndex === 4 + indexMult) {
        document.getElementById(focusIndex).value = '';
        setFocusIndex((prevState) => prevState - 1)
      }

    }
    //ENTER
    if (e.target.id === 'Enter') {
      doSubmit()
    }
  }
  const doSubmit = () => {
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
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    doSubmit()
  };

  // restart the game---v
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
      <div style={{ marginBottom: '2%' }}>
        <h4> {message}</h4>
      </div>
      <form
        key="form1"
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
                onKeyDown={handleInput}
                onClick={() => {
                  setFocusIndex(index);
                }}
                autoComplete="off"
              />
            ))}
          </div>
        </div>
        <button type='submit' style={{ display: 'none' }}></button>
      </form>
      <form
        key="form2"
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
                onKeyDown={handleInput}
                onClick={() => {
                  setFocusIndex(index);
                }}
                autoComplete="off"
              />
            ))}
          </div>
        </div>
        <button type='submit' style={{ display: 'none' }}></button>
      </form>
      <form
        key="form3"
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
                onKeyDown={handleInput}
                onClick={() => {
                  setFocusIndex(index);
                }}
                autoComplete="off"
              />
            ))}
          </div>
        </div>
        <button type='submit' style={{ display: 'none' }}></button>
      </form>
      <form
        key="form4"
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
                onKeyDown={handleInput}
                onClick={() => {
                  setFocusIndex(index);
                }}
                autoComplete="off"
              />
            ))}
          </div>
        </div>
        <button type='submit' style={{ display: 'none' }}></button>
      </form>
      <form
        key="form5"
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
                onKeyDown={handleInput}
                onClick={() => {
                  setFocusIndex(index);
                }}
                autoComplete="off"
              />
            ))}
          </div>
        </div>
        <button type='submit' style={{ display: 'none' }}></button>
      </form>
      <form
        key="form6"
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
                onKeyDown={handleInput}
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
          onClick={handleClick}
          className='btn btn-success'
          style={{ marginTop: '2%', marginBottom: '2%' }}
        >
          Click Here to Play Again
        </button>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2%',
          marginTop: '3%',
          width: '500px',
          cursor: "none"
        }}
      >
        {keyTopRow.map((item, index) => (
          <button key={index} id={item.toLowerCase()} onClick={keyClick} type='button' className='btn btn-light'>
            {item}
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2%',
          marginTop: '3%',
          width: '500px',
        }}
      >
        {keyMidRow.map((item, index) => (
          <button
            key={index + 11}
            id={item.toLowerCase()}
            type='button'
            className='btn btn-light'
            onClick={keyClick}
          >
            {item}
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2%',
          marginTop: '3%',
          width: '500px',
        }}
      >
        {keyLastRow.map((item, index) => (
          <button
            key={index + 10}
            id={item.toLowerCase()}
            type='button'
            className='btn btn-light'
            onClick={keyClick}
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
        <button id='Enter' type='button' className='btn btn-light' onClick={keyClick}>
          RETURN
        </button>
      </div>
    </div>
  );
}
