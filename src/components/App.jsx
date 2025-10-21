import { useState } from 'react';
import ExcelCards from './ExcelReader/ExcelReader';
import Modal from './Modal/Modal';

export const App = () => {

    const [modalBool, setModalBool] = useState(false);
  const [modalSrc, setModalSrc] = useState('');
  const [modalAlt, setModalAlt] = useState('');

    const handleOpenModal = (src, alt) => {
    setModalAlt(alt);
    setModalBool(true);
    setModalSrc(src);
  };

  const handleCloseModal = event => {
    setModalAlt('');
    setModalBool(false);
    setModalSrc('');
  };
  return (
    <div
      style={{
        display: 'flex',

        alignItems: 'center',
        fontSize: 8,
        color: '#010101',
      }}
    >
      <ExcelCards openFullScreenMode={handleOpenModal}/>
            {modalBool && (
        <Modal closeModal={handleCloseModal}>
          <img src={modalSrc} alt={modalAlt} />
        </Modal>
      )}
    </div>
  );
};
