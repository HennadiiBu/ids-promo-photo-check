import style from './Modal.module.css';

import React, { useEffect } from 'react';

function Modal({ closeModal, children }) {
const handleBackDropClick = event=>{
  if (event.target===event.currentTarget) closeModal()
}

  useEffect(() => {
    const handleKeyPress = e => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [closeModal]);

  return (
    <div className={style.modal_container} onClick={handleBackDropClick}>
      <div className={style.modal}>{children}</div>
    </div>
  );
}

export default Modal;