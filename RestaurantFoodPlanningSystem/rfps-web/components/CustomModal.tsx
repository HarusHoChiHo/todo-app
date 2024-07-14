import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import React from "react";

interface ModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    onCancel: () => void;
    onConfirm: () => void;
    header: string;
    children: React.ReactNode;
}

export default function Modals({
                                   isOpen,
                                   onOpenChange,
                                   onCancel,
                                   onConfirm,
                                   header,
                                   children
                               }: ModalProps) {


    return (
        <Modal isOpen={isOpen}
               onOpenChange={onOpenChange}
        >
            <ModalContent>
                {
                    <>
                        <ModalHeader className="flex flex-col gap-1">{header}</ModalHeader>
                        <ModalBody>
                            {children}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger"
                                    variant="light"
                                    onPress={onCancel}>
                                Cancel
                            </Button>
                            <Button color="primary"
                                    onPress={onConfirm}>
                                Confirm
                            </Button>
                        </ModalFooter>
                    </>
                }
            </ModalContent>
        </Modal>
    )
}