import {alphabet} from '../utils'
import {memo} from 'react'

interface ILetterContainer{
  letter:string;
  replacement:string;
  select:(value:string) => void;
  selected:boolean;
}
const LetterContainer = memo(({letter, replacement, select, selected,}:ILetterContainer) => {
  return (
    <li 
      onClick={()=>select(letter)} 
      className={selected ? 'letter highlight' : 'letter normal'}>
      <span 
        tabIndex={-1}
        aria-hidden={replacement === '*'? true : false }
        className={replacement === '*'? 'invisible' : 'visible' } 
        >{replacement}</span>
      <button
        disabled={!alphabet.join('').includes(letter)}
        className={replacement === '*' ? 'active':'inactive'}>{letter}</button>
    </li>
  )
})
export default LetterContainer