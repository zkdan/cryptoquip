import './App.css'
import { useState, useRef, useEffect, useReducer, KeyboardEvent, useCallback } from 'react'
import createCypher, { alphabet, getRandomNumber, invert, IAlphabet, IStringArr } from './utils'
import LetterContainer from './LetterContainer/LetterContainer'
import Modal from './Modal/Modal';
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'
import Alphabet from './Alphabet';

const colors = [
  'mediumorchid', 'pink', '#646cff', '#535bf2', 'magenta'
]

interface IAction {
  type: 'hint' | 'create_pair' | 'clear' | 'solve' | 'remove_letter';
  quipLetter?: string;
  target?: string;
  puzzleKey?: IStringArr;
}

function reducer(state: IAlphabet, action: IAction) {

  if (action.type === 'create_pair') {
    return {
      ...state,
      [action.quipLetter as string]: action.target
    };
  }
  // a hint solves one of the pairs
  if (action.type === 'hint') {
    return {
      ...state,
      [action.quipLetter as string]: action.target
    };
  }
  // the puzzleKey is backwards for the state
  if (action.type === 'solve') {
    if (action.puzzleKey) {
      return invert(action.puzzleKey)
    }
  }
  if (action.type === 'remove_letter') {
    const updatedState = { ...state }

    if (action.quipLetter && action.quipLetter in updatedState) {
      delete updatedState[action.quipLetter as keyof typeof updatedState]
    }
    return {
      ...updatedState,
    }


  }

  if (action.type === 'clear') {
    return {}
  }

  throw Error('Unknown action.')
}
function App() {
  const [state, dispatch] = useReducer(reducer, {});
  const [quip, setQuip] = useState<string[][]>([]);
  const [quipLetter, setQuipLetter] = useState<string>('');
  const [quipKey, setQuipKey] = useState({});
  const [hintCounter, setHintCounter] = useState(0);
  const [author, setAuthor] = useState('');
  const [modal, setModal] = useState(true);
  const [solved, setSolved] = useState(false);
  const lastFocusedElement = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (localStorage.storageInfo) {
      const oldInfo = JSON.parse(localStorage.storageInfo);
      const currentDate = (new Date).getDate();
      const isReturning = currentDate === oldInfo.date
      if (isReturning) {
        setQuip(oldInfo.quip)
        setQuipKey(oldInfo.key)
        setAuthor(oldInfo.author)
      }
    } else {
      const url = 'https://famous-quotes4.p.rapidapi.com/random?category=poetry&count=1';
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_API_KEY,
          'x-rapidapi-host': 'famous-quotes4.p.rapidapi.com'
        }
      };
      console.log(import.meta.env.VITE_API_KEY);
      
      fetch(url, options)
        .then(res => res.json())
        .then(res => {
          res = res[0]

          const quip = createCypher(res.text);
          setAuthor(res.author)
          setQuip(quip[0]);
          setQuipKey(quip[1]);
          const storageInfo = {
            quip: quip[0],
            key: quip[1],
            date: (new Date).getDate(),
            author: res.author
          }
          localStorage.setItem('storageInfo', JSON.stringify(storageInfo))
        })
    }
  }, [])

  useEffect(() => {
    const proposed = Object.values(state).toString()
    const key = Object.keys(quipKey).toString()
    const keyExists = proposed.length > 0 && key.length > 0
    const keysMatch = keyExists && proposed === key;

    if (keysMatch) {
      setSolved(true)
      setHintCounter(3);
    }
  }, [quipKey, state])


  const selectQuipLetter = (value: string) => {

    if (quipLetter === value) {
      setQuipLetter('');
    } else {
      setQuipLetter(value);
    }
  }

  const selectAlphabetLetter = (value: string) => {
    if (quipLetter === value) {
      alert('A letter cannot replace itself.')
      return
    } else if (quipLetter) {
      // if it's already chosen, toggle it
      if (value === state[quipLetter]) {
        dispatch({
          type: 'remove_letter',
          quipLetter
        })
      } else {
        dispatch({
          type: 'create_pair',
          quipLetter,
          target: value
        })
      }
    }
  }

  const reset = () => {
    dispatch({ type: 'clear' })
    setQuipLetter('');
    setSolved(false);
  }

  const getHint = useCallback(() => {
    {
      const keyArr: string[][] = Object.entries(quipKey);
      const hintPair = keyArr[getRandomNumber(keyArr)];
      // hint pair exists and is correct? try another number
      if (state[hintPair[1]] === hintPair[0]) {
        getHint();
      } else {
        dispatch({
          type: 'hint',
          quipLetter: hintPair[1],
          target: hintPair[0],
        })
        setHintCounter(x => x + 1)
      }
    }
  }, [quipKey, state])

  const solve = () => {
    setHintCounter(3)
    setSolved(true)
    dispatch({
      type: 'solve',
      puzzleKey: quipKey
    })
  }

  const handleInstructions =(event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>)=>{
    lastFocusedElement.current = event.currentTarget;
    setModal(true)
  }
  const closeModal = () => {
    setModal(false);
    if (lastFocusedElement.current) {
      lastFocusedElement.current.focus();
    }
  }

  // for confetti package
  const { width, height } = useWindowSize();
  const confetti = solved ? <Confetti height={height - 10} width={width} initialVelocityX={10} initialVelocityY={10} friction={1} wind={0} gravity={.25} numberOfPieces={420} recycle={false} colors={colors} /> : null

  const instructions = <Modal close={closeModal}>
    <h2>Cryptoquote</h2>
    <p>This is a subsitution cypher that, when solved, will reveal some nugget of wisdom from this <a href='https://rapidapi.com/saicoder/api/famous-quotes4'>quotes API</a>.</p>
    <p>For example: the letter A in the puzzle might stand for G in the actual quotation.</p>
    <div className='display-letter-container'>
      <p>G</p>
      <p>A</p>
    </div>
    <p>Each letter is replaced by one other letter (ie. if A replaces G, A will not replace any other letter). But when you're solving, you can have a replacement letter in two places.</p>
    <p>Click a letter in the puzzle to propose a replacement. Click a second time to change your mind.</p>
  </Modal>

  const checkKey = (e: KeyboardEvent) => {
    if (quipLetter && alphabet.join('').includes(e.key)) {
      selectAlphabetLetter(e.key)
    }
  }
  return (
    <main
      onKeyDown={checkKey}
    >
      {confetti}
      <h1>Cryptoquote</h1>
      {modal ? instructions : <></>}
      <ul className='quip'>
        {quip.map((word, i) => {
          const letters = word.map((letter: string, i: number) => {
            return <LetterContainer
              letter={letter.toLowerCase()}
              key={`${i}-${letter}`}
              replacement={state[letter] || '*'}
              selected={quipLetter === letter}
              select={selectQuipLetter} />
          })
          return <li key={i}><ul>{letters}</ul></li>
        })
        }
      </ul>
      <aside>
        <h2> -{author}</h2>
      </aside>
      <Alphabet
        lettersInUse={Object.values(state)}
        select={selectAlphabetLetter}
        quipLetter={quipLetter}
      />
      <div className='button-container game-actions'>
        <button onClick={reset}>Clear all</button>
        <button onClick={getHint} disabled={hintCounter > 2}>Hint</button>
        <button onClick={solve} disabled={solved} >Give up</button>
        <button onClick={handleInstructions}>Instructions</button>
      </div>
    </main>
  )

}

export default App
