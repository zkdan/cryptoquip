import { useState, useEffect, useReducer } from 'react'
import createCypher, {alphabet} from './utils'
import './App.css'

interface ILetterContainer{
  letter:string;
  replacement:string;
  select:(value:string) => void;
  selected:boolean;
}
const LetterContainer = ({letter, replacement, select, selected}:ILetterContainer) => {
  return (
    <li 
    onClick={()=>select(letter)} 
    className={selected ? 'highlight' : 'normal'}>
      <span className={replacement === '*'? 'invisible' : 'visible' } >{replacement}</span>
      <span className={replacement === '*'? 'active':'inactive'}>{letter}</span>
    </li>
  )
}
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
  throw Error('Unknown action.')
}
function App() {
  const [state, dispatch] = useReducer(reducer, {});
  const [quip, setQuip] = useState([]);
  const [quipLetter, setQuipLetter] = useState('');

  useEffect(()=>{
    fetch('https://api.quotable.io/random?maxLength=38')
    .then(res =>res.json())
    .then(res => {
      console.log(res.content)
      const quipArray = createCypher(res.content).toLowerCase().split('');
      setQuip(quipArray);
    })
  }, [])

  const selectQuipLetter =(value:string)=>{
    if(!quipLetter){
      setQuipLetter(value);
    } 
    if(quipLetter ===value){
      setQuipLetter('');
    }
     else{
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
  return (
    <>
      <ul className="quip"> 
      { quip.map(letter =>{
        if(alphabet.includes(letter) === false){
          return <li className="space"></li>
        } else {
          return <LetterContainer 
                    selected={quipLetter===letter}
                    letter={letter} 
                    replacement={state[letter] || '*'}
                    select={selectQuipLetter}/>
        }
        })}
      </ul>
    
      <ul className="alphabet">
        {alphabet.map((letter:string) =>{
          const inUse = Object.values(state).includes(letter);
          return <li key={letter} 
                    onClick={()=>selectAlphabetLetter(letter)} 
                    className={inUse || quipLetter === letter ? 'inactive': 'active'}>{letter}</li>
        })}
      </ul>
    </>
  )
}

export default App
