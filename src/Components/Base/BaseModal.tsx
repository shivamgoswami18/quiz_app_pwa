import React, { ReactElement } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import BaseButton from "./BaseButton";

interface BaseModalProps {
  className?: string;
  bodyClassName?: string;
  size?: string;
  footerClassName?: string;
  open?: boolean;
  onClose?: () => void;
  children?: ReactElement;
  title?: string;
  toggle?: () => void;
  submit?: () => void;
  closeLabel?: string;
  submitLabel?: string;
  closeLabelColor?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "link";
  submitLabelColor?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "link";
  loader?: boolean;
  isSubmitDisabled?: boolean;
}

const BaseModal: React.FC<BaseModalProps> = ({
  className,
  bodyClassName,
  size,
  footerClassName,
  open,
  onClose,
  children,
  title,
  toggle,
  submit,
  closeLabel,
  submitLabel,
  closeLabelColor,
  submitLabelColor,
  loader,
  isSubmitDisabled,
}) => {
  return (
    <Modal
      isOpen={open}
      toggle={toggle}
      size={size}
      className={className}
      centered
    >
      {title && (
        <ModalHeader toggle={toggle} className="border-bottom py-2">
          {title}
        </ModalHeader>
      )}

      <ModalBody className={bodyClassName}>{children}</ModalBody>

      <ModalFooter className={footerClassName}>
        {submit && (
          <BaseButton
            color={submitLabelColor}
            onClick={submit}
            disable={isSubmitDisabled}
            loader={loader}
            dataTest="modal-submit"
          >
            {submitLabel}
          </BaseButton>
        )}

        {toggle && (
          <BaseButton color={closeLabelColor} onClick={toggle} className="me-2" dataTest="modal-close">
            {closeLabel}
          </BaseButton>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default BaseModal;
