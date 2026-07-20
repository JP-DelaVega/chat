import React from 'react';
import styles from "./ClearChatModal.module.css";

function ClearChatModal({ handleReset, toggleModal }) {
    const onClear = () => {
        handleReset();
        toggleModal();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.card}>
                <div className={styles.head}>
                    <span>SYSTEM WARNING</span>
                    <button className={styles.closeButton} onClick={toggleModal} aria-label="Close modal">
                        ×
                    </button>
                </div>
                <div className={styles.content}>
                    Are you sure you want to restart? All messages will be removed.
                    <br />
                    <button className={styles.button} onClick={onClear}>Restart</button>
                </div>
            </div>
        </div>
    );
}

export default ClearChatModal;