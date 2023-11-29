// React Imports
import React from 'react';
// Component Imports
import ConfirmationModal from './ConfirmationModal';

// Display text for confirmation modal variants
const confirmationModalContentVariant = {
  replace: {
    title: 'Replace Document?',
    text: 'A file of this name and type already exists on the pod. Would you like to replace it?',
    confirmButtonText: 'Replace'
  },
  add: {
    title: 'Upload Document?',
    text: 'Are you sure you want to upload this document?',
    confirmButtonText: 'Upload'
  }
};

/**
 * UploadDocumentConfirmationModal Component - Custom ConfirmationModal
 * based on the type of document upload (add or replace) that the user is attempting to perform.
 *
 * @memberof Modals
 * @name UploadDocumentModal
 * @param {object} Props - Props for UploadDocumentModal component
 * @param {boolean} Props.showModal - Boolean for showing/hiding the modal
 * @param {React.Dispatch<React.SetStateAction<boolean>>} Props.setShowModal
 * - React set function for setting showModal state
 * @param {string} Props.uploadType - Type of upload to perform (add or replace)
 * @param {Function} Props.onConfirm - Function to run when the user confirms the upload
 * @param {Function} Props.onCancel - Function to run when the user cancels the upload
 * @returns {React.JSX.Element} The UploadDocumentConfirmationModal Component
 */
const UploadDocumentConfirmationModal = ({
  showModal,
  setShowModal,
  uploadType,
  onConfirm,
  onCancel
}) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const modalContent = confirmationModalContentVariant[uploadType];

  const handleConfirm = async () => {
    setIsProcessing(true);
    onConfirm();
  };

  return (
    <ConfirmationModal
      showModal={showModal}
      setShowModal={setShowModal}
      title={modalContent.title}
      text={modalContent.text}
      confirmButtonText={modalContent.confirmButtonText}
      onConfirm={handleConfirm}
      onCancel={onCancel}
      processing={isProcessing}
    />
  );
};

export default UploadDocumentConfirmationModal;
