/** A chat message as returned by the API */
export interface Message {
  _id: string;
  message: string;
  author: string;
  createdAt: string;
}
