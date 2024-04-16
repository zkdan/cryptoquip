import { useEffect } from 'react'
import {IStringArr} from './utils' 
import './Author.css'
const Author =({author}:IStringArr)=>{
    useEffect(()=>{
      fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${author}`).then(res=>res.json())
    },[author])
    return(
      <aside>
        <h2> -{author}</h2>
      </aside>
    )
  }
export default Author;