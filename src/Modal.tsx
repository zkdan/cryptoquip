import './Modal.css'
import {PropsWithChildren, ReactElement} from 'react';

type IModal = {
  close:()=>void;
  children:ReactElement;
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