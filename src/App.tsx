import './App.css'
import { useState, useEffect, useReducer } from 'react'
import createCypher, {alphabet} from './utils'
import LetterContainer from './LetterContainer'
interface IAction{
  [key:string]:string
}

function reducer(state:IAction, action:IAction){
  if (action.type === 'create_pair') {
    // if it exists already, toggle it
    if(state[action.quipLetter] === action.target){
      action.target = ''
    }
    return {
      ...state,
      [action.quipLetter]: action.target
    };
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

  useEffect(()=>{
    fetch('https://api.quotable.io/random?maxLength=38')
    .then(res =>res.json())
    .then(res => {
      const quip = createCypher(res.content);
      setQuip(quip);
    })
  }, [])

  const selectQuipLetter =(value:string)=>{
    // if(!quipLetter){
    //   setQuipLetter(value);
    // } 
    if(quipLetter === value){
      setQuipLetter('');
    }
     else {
      setQuipLetter(value)
     }
  }

  const selectAlphabetLetter =(value:string)=>{
    if(quipLetter){
      // if(quipLetter === value){
      //   alert('A letter will never be replaced with itself.')
      // }
      dispatch({
        type:'create_pair', 
        quipLetter, 
        target:value
      })
    }
  }
  const reset =()=>{
    dispatch({type:'clear'})
    setQuipLetter('');
  }
  return (
    <>
      <ul className="quip"> 
      {quip.map(word=>{
        const letters = word.map((letter)=>{
          return <LetterContainer 
                    letter={letter.toLowerCase()} 
                    replacement={state[letter] || '*'}
                    selected={quipLetter===letter}
                    select={selectQuipLetter}/>
        })
        return <ul>{letters}</ul>
      })
      }
      </ul>
    
      <ul className="alphabet">
        {alphabet.map((letter:string) =>{
          const inUse = Object.values(state).includes(letter);
          return <li key={letter} 
                    onClick={()=>selectAlphabetLetter(letter)} 
                    className={inUse || quipLetter === letter ? 'inactive': 'active'}>{letter}</li>
        })}
      </ul>
      <button onClick={reset}>Clear all</button>
    </>
  )
}

export default App
