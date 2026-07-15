import React from 'react';
import { createPortal } from 'react-dom';
import styles from "./ClearChatModal.module.css";

function ClearChatModal({ handleReset, toggleModal }) {
    const onClear = () => {
        handleReset();
        toggleModal();
    };

    // 1. Build your modal layout
    const modalContent = (
        <div className={styles.overlay}>
            <div className={styles.card}>
                <div className={styles.head}>
                    <span>SYSTEM WARNING</span>
                    <button className={styles.closeButton} onClick={toggleModal} aria-label="Close modal">
                        ×
                    </button>
                </div>
                <div className={styles.content}>
                    Are you sure you want to clear the chat history? All messages will be removed.
                    <br />
                    <button className={styles.button} onClick={onClear}>Clear</button>
                </div>
            </div>
        </div>
    );

    // 2. Teleport this layout out of the nested components and directly into document.body
    return createPortal(modalContent, document.body);
}

export default ClearChatModal;