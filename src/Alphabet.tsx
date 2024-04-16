import {memo} from 'react'
import {alphabet} from './utils'
interface IAlphabet{
  quipLetter:string,
  lettersInUse:string[],
  select:(letter:string)=>void

}
const Alphabet = memo(({ quipLetter, lettersInUse, select}:IAlphabet )=> {
return(
<ul className='alphabet'>
        {alphabet.map((letter:string) => {
          const inUse = lettersInUse.includes(letter);
          return <li 
                  key={letter}
                  onClick={()=>select(letter)} >
                    <button
                    key={letter} 
                    className={inUse || quipLetter === letter ? 'inactive': 'active'}>{letter}</button>
                  </li>
        })}
      </ul>
)
})
export default Alphabet;