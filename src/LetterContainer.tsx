
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
export default LetterContainer