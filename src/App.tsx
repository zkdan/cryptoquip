import './App.css'
import { useState, useEffect, useReducer } from 'react'
import createCypher, {alphabet, getRandomNumber, invert, IAlphabet, IStringArr} from './utils'
import Author from './Author';
import LetterContainer from './LetterContainer'
import Modal from './Modal';
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'
const colors= [
  'mediumorchid', 'pink', '#646cff', '#535bf2', 'magenta'
]
interface IAction{
  type: 'hint' | 'create_pair'| 'clear' | 'solve';  
  quipLetter?:string;
  target?:string;
  puzzleKey?:IStringArr;
}
function reducer(state:IAlphabet, action:IAction){
  
  if (action.type === 'create_pair') {
    return {
      ...state,
      [action.quipLetter!]: action.target
    };
  }
  // a hint solves one of the pairs
  if(action.type === 'hint'){
    return {
      ...state,
      [action.quipLetter!]: action.target
    };
  } 
  // the puzzleKey is backwards for the state
  if(action.type === 'solve'){
    if(action.puzzleKey){
      return invert(action.puzzleKey)
    }
  }

  if(action.type === 'clear'){
    return {}
  }

  throw Error('Unknown action.')
}
function App() {
  const [state, dispatch] = useReducer(reducer, {});
  const [quip, setQuip] = useState<string[][]>([]);
  const [quipLetter, setQuipLetter] = useState<string>('');
  const [quipKey, setQuipKey] = useState({});
  const [hintCounter,setHintCounter] = useState(0);
  const [author, setAuthor] = useState('');  
  const [modal, setModal] = useState(true);
  const [solved, setSolved] = useState(false);


  useEffect(()=>{
    fetch('https://api.quotable.io/random?maxLength=38')
    .then(res =>res.json())
    .then(res => {
      const quip = createCypher(res.content);
      setAuthor(res.author)
      setQuip(quip[0]);
      setQuipKey(quip[1]);
    })
  }, [])

  useEffect(()=>{
    const proposedArr = Object.entries(state).sort();
    const keyArr = Object.entries(invert(quipKey)).sort();
    if(JSON.stringify(state) !=='{}'){
      check(proposedArr, keyArr);
    }
  },[state, quipKey]);

  const selectQuipLetter =(value:string)=>{

    if(quipLetter === value){
      setQuipLetter('');
    }
     else {
      setQuipLetter(value);
     }
  }

  const selectAlphabetLetter = (value:string)=>{
    if(quipLetter === value){
      alert('A letter cannot replace itself.')
    } else if(quipLetter){
      // if it's already chosen, toggle it
      if(value === state[quipLetter]){
        value = ''
      }
      dispatch({
        type:'create_pair', 
        quipLetter, 
        target:value
      })
    }
  }

  const reset = () =>{
    dispatch({type:'clear'})
    setQuipLetter('');
    setSolved(false);
  }

  const getHint = () =>{
    const keyArr:string[][] = Object.entries(quipKey);
    const hintPair = keyArr[getRandomNumber(keyArr)];
    // hint pair exists and is correct? try another number
    if(state[hintPair[1]] === hintPair[0]){
      getHint();
    } else {
      dispatch({
        type:'hint', 
        quipLetter: hintPair[1],
        target: hintPair[0],
      })
      setHintCounter(x => x+1);
    }
  }

  const check = (proposed:string[][], key:string[][]) =>{
    const hasProposed = JSON.stringify(proposed) !=='{}';
    const keysMatch = JSON.stringify(proposed) === JSON.stringify(key);
    if(hasProposed && keysMatch){
      setSolved(true);
      setHintCounter(3);
    }
  }

  const solve =()=>{
    setHintCounter(3);
    dispatch({
      type:'solve',
      puzzleKey:quipKey
    })
  }

  const closeModal=()=>{
    setModal(false);
  }

  // for confetti package
  const {width, height} = useWindowSize();
  const confetti = solved ? <Confetti height={height} width={width} initialVelocityX={10} initialVelocityY={10} friction={1} wind={0} gravity={.25} numberOfPieces={120} recycle={false} colors={colors} /> : <></>
  

  const instructions = modal ? 
                <Modal close={closeModal}>
                  <h2>Cryptoquote</h2>
                  <p>This is a subsitution cypher that, when solved, will reveal some nugget of wisdom from this <a href='https://github.com/lukePeavey/quotable#api-reference-'>quotes API</a>.</p>
                  <p>For example: the letter A in the puzzle might stand for G in the actual quotation.</p>
                  <ul>
                  <LetterContainer 
                                displayOnly={true}
                                letter={'A'} 
                                replacement={'G'}
                                selected={false}
                                select={()=>{}}/>
                  </ul>
                  <p>Each letter is replaced by one other letter (ie. if A replaces G, A will not replace any other letter). But when you're solving, you can have a replacement letter in two places.</p>
                  <p>Click a letter in the puzzle to propose a replacement. Click a second time to change your mind.</p>
                </Modal> :
                <></>

  // const checkKey=(e)=>{
  //   if(quipLetter && alphabet.join('').includes(e.key)){
  //     selectAlphabetLetter(e.key)
  //   }
  // }
  return (
    <main 
    // onKeyDown={checkKey}
    >
      <h1>Cryptoquote</h1>
    {confetti}
    {instructions}
      <ul className='quip'> 
      {quip.map((word)=>{
        const letters = word.map((letter:string, i:number)=>{
          return <LetterContainer
                    letter={letter.toLowerCase()} 
                    key={`${i}-${letter}`}
                    replacement={state[letter] || '*'}
                    selected={quipLetter===letter}
                    select={selectQuipLetter}/>
        })
        return <li><ul>{letters}</ul></li>
      })
      }
      </ul>
      <Author author={author}/>
      <ul className='alphabet'>
        {alphabet.map((letter:string) => {
          const inUse = Object.values(state).includes(letter);
          return <li onClick={()=>selectAlphabetLetter(letter)} >
                    <button
                    key={letter} 
                    className={inUse || quipLetter === letter ? 'inactive': 'active'}>{letter}</button>
                  </li>
        })}
      </ul>
      <div className='button-container game-actions'>
        <button onClick={reset}>Clear all</button>
        <button onClick={getHint} disabled={hintCounter===3}>Hint</button>
        <button onClick={solve} disabled={solved} >Give up</button>
        <button onClick={() => setModal(true)}>Instructions</button>
      </div>
    </main>
  )
  
}

export default App
