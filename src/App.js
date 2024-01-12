import { useState } from 'react';
import Tutorial from './Tutorial';
import WordGuess from './WordGuess';

function App() {
  const [page, setPage] = useState('tutorial');
  const [gameKey, setGameKey] = useState(0);

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
          {page.current !== 'tutorial' && (
            <>
              <WordGuess
                key={gameKey}
                updateKey={updateKey}
              />
            </>
          )}
        </div>
      </>
    );
  }
}

export default App;
