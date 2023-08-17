export default interface IMessage {
  _id: string;
  listId: string;
  userId: string;
  username: string;
  textContent: string;
  createdAt: string;
  pending?: boolean;
}
