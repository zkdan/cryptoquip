export const alphabet = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

interface IStringArr {
 [key:string]:string
} 

export interface IAlphabet{
  a?:string;
  b?:string;
  c?:string;
  d?:string;
  e?:string;
  f?:string;
  g?:string;
  h?:string;
  i?:string;
  j?:string;
  k?:string;
  l?:string;
  m?:string;
  n?:string;
  o?:string;
  p?:string;
  q?:string;
  r?:string;
  s?:string;
  t?:string;
  u?:string;
  v?:string;
  w?:string;
  x?:string;
  y?:string;
  z?:string;
}

const createCypher = (phrase:string):string[][] =>{
  const arrayedPhrase = phrase.toLowerCase().split('');
  const uniqueLetters = Array.from(new Set(arrayedPhrase)).filter(item => alphabet.includes(item));
  const analogues:IStringArr = createAnalogues(uniqueLetters, alphabet);

  const cryptoquote =  phrase.split(' ').map(word =>{
    return word.toLowerCase().split('').map(char =>{
      if(alphabet.includes(char)){
        return analogues[char]
      } else {
        return char
      }
    })
  });

  return [cryptoquote, analogues]
}
// have uniqueLettters and analogues
// need to go through original phrase and find each letter in unique letters and in analogues
const createPairings = (orig:string[], analogues:string[]) =>{
  const pairs = orig.reduce((acc:IStringArr, curr, i) =>{
      if(acc[curr]){
      return acc
    } else {
      acc[curr] = analogues[i]
    }
    return acc
  }, {})
  return pairs
  // return invert(pairs);
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

export const invert =(obj:object)=>{ 
  const retobj = {}; 
  for(const key in obj){ 
    retobj[obj[key]] = key; 
  } 
  return retobj; 
} 
export const getRandomNumber =(arr:string[] | [string][])=>{
  return Math.floor(Math.random() * arr.length)
}

export default createCypher