import './Modal.css'
import {PropsWithChildren, ReactNode, useEffect, useRef} from 'react';

type IModal = {
  close:()=>void;
  children:ReactNode;
}
const Modal = ({children, close}:PropsWithChildren<IModal>) => {
  const modalRef=useRef(null);
useEffect(()=>{
  if(modalRef.current !==null){
    modalRef.current.focus();
  }
},[modalRef])
  const checkForEsc =(e)=>{
    if(e.keyCode ===27){
      close();
    }
  }
return(
  <div ref={modalRef} tabIndex={1} className="modal" onKeyDown={checkForEsc}>
    <button onClick={close}>x</button>
    {children}
  </div>
)
}
export default Modal;