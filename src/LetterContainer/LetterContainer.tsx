import {alphabet} from '../utils'

interface ILetterContainer{
  letter:string;
  replacement:string;
  select:(value:string) => void;
  selected:boolean;
  displayOnly?:boolean
}
const LetterContainer = ({letter, replacement, select, selected, displayOnly}:ILetterContainer) => {
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
        tabIndex={ displayOnly ? -1 : 0}
        disabled={!alphabet.join('').includes(letter)}
        className={replacement === '*' ? 'active':'inactive'}>{letter}</button>
    </li>
  )
}
export default LetterContainer