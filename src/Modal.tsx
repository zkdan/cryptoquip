import './Modal.css'
import {PropsWithChildren, ReactNode, useEffect, useRef, KeyboardEvent} from 'react';

type IModal = {
  close:()=>void;
  children:ReactNode;
}
const Modal = ({children, close}:PropsWithChildren<IModal>) => {
  const modalRef=useRef<HTMLInputElement>(null);

useEffect(()=>{
  if(modalRef.current !==null){
    modalRef.current.focus();
  }
},[modalRef])
  const checkForEsc =(e:KeyboardEvent<HTMLDivElement>)=>{
    if(e.keyCode ===27){
      close();
    }
  }
return(
  <div ref={modalRef} tabIndex={1} className="modal" onKeyDown={checkForEsc}>
    <button onClick={close} tabIndex={1}>x</button>
    {children}
  </div>
)
}
export default Modal;