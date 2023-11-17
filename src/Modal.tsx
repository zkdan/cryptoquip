import './Modal.css'
import {PropsWithChildren, ReactNode} from 'react';

type IModal = {
  close:()=>void;
  children:ReactNode;
}
const Modal = ({children, close}:PropsWithChildren<IModal>) => {
return(
  <div className="modal">
    <button onClick={close}>x</button>
    {children}
  </div>
)
}
export default Modal;