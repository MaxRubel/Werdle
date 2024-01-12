export default function Tutorial(props) {
  const { changeTut } = props;

  const handleKey = () => {
    setTimeout(() => {
      changeTut('playing');
    }, 10);
  };

  window.addEventListener('keydown', handleKey);

  return (
    <div
      tabIndex={0}
      id='tutorialScreen'
      className='wordle-container'
      onKeyDown={handleKey}
    >
      <div>
        <h2><strong>Welcome to Werdle!</strong></h2>
      </div>
      <div style={{ fontSize: '24px', marginTop: '3%' }}>
        You have 6 chances to guess the 5-letter word.
      </div>
      <div style={{ fontSize: '16px', marginTop: '2%' }}>
        If a letter is in the word and placed correctly, it will appear{' '}
        <span style={{ color: 'green' }}>green.</span>
      </div>
      <div style={{ fontSize: '16px', marginTop: '1%' }}>
        If a letter is in the word but placed in the wrong spot, it will appear{' '}
        {''}
        <span style={{ color: 'yellow', backgroundColor: 'black' }}>
          yellow.
        </span>
      </div>
      <div style={{ fontSize: '16px', marginTop: '1%' }}>
        If a letter is not in the word, it will appear{' '}
        <span style={{ color: 'grey' }}>grey.</span>
      </div>
      <div style={{ fontSize: '16px', marginTop: '4%' }}>
        <strong>
          Type your guess into each row, and press the 'RETURN' key to submit
          it.
        </strong>
      </div>
      <div style={{ fontSize: '16px', marginTop: '3%' }}>
        PRESS ANY KEY TO CONTINUE
      </div>
    </div>
  );
}
