import { useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  children: ReactNode;
  onClose: () => void;
};

function Modal({ open, children, onClose }: ModalProps) {
  const dialog = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [open]);

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {open ? children : null}
    </dialog>,
    document.getElementById("modal")!
  );
}

export default Modal;
