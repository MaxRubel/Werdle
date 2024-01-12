const arrayBusiness = (guess, word) => {
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
      obj.letter = guess[i]
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
      obj.letter = guess[i]
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
      obj.letter = guess[i]
      displayArray.push(obj);
    }
  }
  return ({ displayArray: displayArray, exactPlacement: exactPlacement, approxPlacement: approxPlacement, })
}

export default arrayBusiness