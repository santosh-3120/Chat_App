import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import './profileModal.css';

interface ProfileModalProps {
  user: any;
  children?: React.ReactNode;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  if(!user) return null;

  return (
    <>
      {children ? <span onClick={onOpen}>{children}</span> : <IconButton icon={<ViewIcon />} onClick={onOpen} aria-label="View profile" />}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent className="profile-modal">
          <ModalHeader className="profile-modal-header">{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="profile-modal-body">
            <Image className="profile-modal-image" src={user.pic} alt={user.name} />
            <Text className="profile-modal-email">
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;