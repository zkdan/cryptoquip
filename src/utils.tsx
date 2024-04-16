export const alphabet = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

export interface IStringArr {
 [key:string]:string
} 

// the only options are these values - no others. the object, though, will be built little by little so they're all optional at start
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

// takes a phrase from the API, returning an array of strings and an object that contains pairings of letters for the cypher
const createCypher = (phrase:string):[string[][], IAlphabet] =>{
  // split into invidual letters, lowercase because the strings need to be lowercase to compare later
  const arrayedPhrase = phrase.toLowerCase().split('');
  // find all unique letters so we can assign them analogues
  const uniqueLetters = Array.from(new Set(arrayedPhrase)).filter(item => alphabet.includes(item));
  // analogs is an array of stings, use the unique letters and the alphabet array to make pairings say, a = k
  const analogues:IStringArr = createAnalogues(uniqueLetters, alphabet);

  // for each word in the phrase, 
  const cryptoquote =  phrase.split(' ').map(word =>{
  // check each letter in each phrase 
    return word.toLowerCase().split('').map(char =>{
      // and see if 1) it is a legal letter
      if(alphabet.includes(char)){
        // if so, return out the analogue letter, creating the cypher
        return analogues[char]
      } else {
        // otherwise, return that character - used for punctuation
        return char
      }
    })
  });
  return [cryptoquote, analogues]
}

// using the original quotation as an array of strings (one for each word) and the analogues created (but not assigned to any original letter) on line 44 , combine and reduce the multidimensional array into a single object{someLetter:someOtherLetter}
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
}

// this creates an array that parallels the unique letters array so we can use indexes to create the cypher
const createAnalogues = (orig:string[], pool:string[])=>{
  let localPool = pool;
  // console.log(orig, pool);
  // for each letter from the original set of letters
  const randomLetters =  orig.map((letter:string) => {
    // choose an analogue for that letter from the pool
    const targetLetter = chooseLetter(letter, localPool);
    // update the pool (remove the just-chosen letter)
    localPool = exciseLetter(targetLetter,  localPool);
    // return the letter that is now paired with the original letter
    return targetLetter
  });
  // console.log(randomLetters);
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

// choose letter from pool
const chooseLetter =(orig:string, pool:string[]):string =>{
  const num = getRandomNumber(pool);
  if(pool[num] === orig){
    return chooseLetter(orig, pool)
  } 
    return pool[num]
}

// swap object from {a:x} to {x:a}

// we need to use this in the game because instead of starting with the right letter, we're starting with the wrong letter
// so, we created {realLetter:cypherLetter} but in gameplay
// we choose the cypher letter first {cypherLetter:realLetter}
// this is definitely a candidate for a refactor
export const invert =(obj:IStringArr)=>{ 
  const retobj:{
    [key:string]:string
  } = {}; 
  for(const key in obj){ 
    retobj[obj[key]] = key; 
  } 
  return retobj; 
} 

export const getRandomNumber =(arr:string[] | string[][]):number=>{
  return Math.floor(Math.random() * arr.length)
}

export default createCypher