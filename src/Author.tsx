import { useEffect } from 'react'

const Author =({author})=>{
    useEffect(()=>{
      fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${author}`).then(res=>res.json()).then(res=> console.log(res))
    },[author])
    return(
      <aside>
        <h2>{author}</h2>
      </aside>
    )
  }
export default Author;