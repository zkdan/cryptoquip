export const alphabet = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

interface IStringArr {
  [key: string]: string;
} 

const createCypher = (phrase:string) =>{
  const arrayedPhrase = phrase.toLowerCase().split('');
  const uniqueLetters = Array.from(new Set(arrayedPhrase)).filter(item => alphabet.includes(item));
  const analogues = createAnalogues(uniqueLetters, alphabet);

  const quip =  arrayedPhrase.map((char:string) =>{
    if(alphabet.includes(char) === false){
      return char
    } else {
      return analogues[char]
    }
  });
 
// return cyphered version
return quip.join('') 
}
//have uniqueLettters and analogues
// need ot go through original phrase and find each letter in unique letters and in analogues
const createPairings = (orig:string[], analogues:string[]) =>{
  return orig.reduce((acc:IStringArr, curr, i) =>{
      if(acc[curr]){
      return acc
    } else {
      acc[curr] = analogues[i]
    }
    return acc
  }, {})
}

const createAnalogues = (orig:string[], pool:string[])=>{
  let localPool = pool;
  const randomLetters =  orig.map((letter:string) => {
    const targetLetter = chooseLetter(letter, localPool);
    localPool = exciseLetter(targetLetter,  localPool);
    return targetLetter
  });
  return createPairings(orig, randomLetters)
}

const exciseLetter =(letter:string, arr:string[])=>{
  if(arr.indexOf(letter) === 0){
    arr.shift();
    return arr
  } else {
    const firstHalf = arr.slice(0, arr.indexOf(letter));
    const secondHalf = arr.slice(arr.indexOf(letter)+1)
    const newArr = [...firstHalf, ...secondHalf]
    return newArr
  }
}

const chooseLetter =(orig:string, pool:string[]):string =>{
  const num = getRandomNumber(pool);
  if(pool[num] === orig){
    return chooseLetter(orig, pool)
  } 
    return pool[num]
}

const getRandomNumber =(arr:string[])=>{
  return Math.floor(Math.random() * arr.length)
}

export default createCypher