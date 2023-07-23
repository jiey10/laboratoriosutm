import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const CustomModal = ({ showModal, onClose, title, children }) => {
    return (
        <Modal show={showModal} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
        </Modal>
    );
};

export default CustomModal;


