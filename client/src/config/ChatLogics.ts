export const getSender = (loggedUser: any, users: any[]) => {
  if (!loggedUser || !users || users.length < 2) return "Unknown User";
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};


export const getSenderFull = (loggedUser: any, users: any[]) => {
  if (!loggedUser || !users || users.length < 2) return null;
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};


export const isSameSender = (messages: any[], m: any, i: number, userId: string) => {
  if (!m || !m.sender || !messages[i]) return false;

  const nextMessage = messages[i + 1];
  const nextSenderId = nextMessage?.sender?._id;

  return (
    i < messages.length - 1 &&
    (nextSenderId !== m.sender._id || nextSenderId === undefined) &&
    m.sender._id !== userId
  );
};


export const isLastMessage = (messages: any[], i: number, userId: string) => {
  if (!messages || messages.length === 0) return false;

  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || !lastMessage.sender) return false;

  return i === messages.length - 1 && lastMessage.sender._id !== userId;
};


export const isSameSenderMargin = (messages: any[], m: any, i: number, userId: string) => {
  if (!messages || !m || !m.sender) return 'auto';

  const nextMessageSenderId = messages[i + 1]?.sender?._id;
  const currentMessageSenderId = m.sender._id;

  if (i < messages.length - 1 && nextMessageSenderId === currentMessageSenderId && currentMessageSenderId !== userId) {
    return 33;
  } else if (
    (i < messages.length - 1 && nextMessageSenderId !== currentMessageSenderId && currentMessageSenderId !== userId) ||
    (i === messages.length - 1 && currentMessageSenderId !== userId)
  ) {
    return 0;
  } else {
    return 'auto';
  }
};


export const isSameUser = (messages: any[], m: any, i: number) => {
  if (!messages || !m || !m.sender) return false;
  const prevMessageSenderId = messages[i - 1]?.sender?._id;
  const currentMessageSenderId = m.sender._id;
  return i > 0 && prevMessageSenderId === currentMessageSenderId;
};
    