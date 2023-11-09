import { useState, useEffect } from 'react'
import createCypher, {alphabet} from './utils'
import './App.css'

interface ILetterContainer{
  letter:string;
  replacement:string;
  select:(value:string, origin:string) => void;
  selected:boolean;
}
const LetterContainer = ({letter, replacement, select, selected}:ILetterContainer) => {
  return (
    <li 
    onClick={()=>select(letter, 'quip')} 
    className={selected ? 'highlight' : 'normal'}>
      <span className={replacement === '*'? 'invisible' : 'visible' } >{replacement}</span>
      <span>{letter}</span>
    </li>
  )
}

function App() {
  const [quip, setQuip] = useState([]);
  const [lettersInUse, setLettersInUse] = useState([]);
  const [poolLetter, setPoolLetter] = useState('');
  const [quipLetter, setQuipLetter] = useState('');

  useEffect(()=>{
    fetch(`https://api.quotable.io/random?maxLength=38`)
    .then(res =>res.json())
    .then(res => {
      const quipArray = createCypher(res.content).toLowerCase().split('');
      setQuip(quipArray);
    })
  }, [])

  const selectLetter =(value:string, origin:string)=>{
    if(origin === 'quip'){
      setQuipLetter(value);

    }
    if(origin === 'alphabet'){
      if(quipLetter){
        setPoolLetter(value);
        // setLettersInUse(x => [...x, {orig:quipLetter, target:value}])
      }
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
                    replacement={'*'} 
                    select={selectLetter}/>
        }
        })}
      </ul>
    
      <ul className="alphabet">
        {alphabet.map((letter:string) =>{
          const inUse = lettersInUse.includes(letter);
          return <li key={letter} onClick={()=>selectLetter(letter, 
            'alphabet')} className={inUse ? 'in-use': 'not'}>{letter}</li>
        })}
      </ul>
    </>
  )
}

export default App
