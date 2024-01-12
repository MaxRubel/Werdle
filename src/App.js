import { useState } from 'react';
import Tutorial from './Tutorial';
import WordGuess from './WordGuess';
import Keyboard from './Keyboard';
function App() {
  const [message, setMessage] = useState('WERDLE!');
  const [page, setPage] = useState('tutorial');
  const [gameKey, setGameKey] = useState(0);

  const messageChild = (value) => {
    setMessage(value);
  };

  const changeTut = (value) => {
    setPage(value);
  };

  const updateKey = () => {
    setGameKey((prevState) => prevState + 1);
  };

  if (page === 'tutorial') {
    return <Tutorial changeTut={changeTut} />;
  }
  if (page === 'playing') {
    return (
      <>
        <div className='wordle-container'>
          <div style={{ marginBottom: '6%' }}>
            <h3>{message}</h3>
          </div>
          {page.current !== 'tutorial' && (
            <>
              <WordGuess
                key={gameKey}
                updateKey={updateKey}
                messageChild={messageChild}
              />
              <Keyboard key={gameKey} />
            </>
          )}
        </div>
      </>
    );
  }
}

export default App;
