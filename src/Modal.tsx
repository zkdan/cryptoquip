import './Modal.css'
const Modal = ({children, close}) => {
return(
  <div className="modal">
    <button onClick={close}>x</button>
    {children}
  </div>
)
}
export default Modal;