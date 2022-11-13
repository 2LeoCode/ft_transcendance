import { Channel } from "./channel.com";
import { User } from "./user.com";

export interface Message {
  id: string;
  content: string;
  createDate: Date;
  updateDate: Date;
  sender: User;
  type: 'private' | 'channel' | 'global';
  channelReceiver: Channel;
  userReceiver: User;
}

export namespace MessageCom {

  /* Get message(s) from the database
    * using the following optional filters:
    * id, createDate, updateDate, senderId, type, channelReceiverId, userReceiverId */
  export async function get(opts: {
    id?: string,
    createDate?: Date,
    updateDate?: Date,
    senderId?: string,
    type?: 'private' | 'channel' | 'global',
    receiverId?: string
  }) {
    let url = 'http://localhost:2000/message?';
    for (const key in opts)
      url += `${key}=${opts[key as keyof typeof opts]}&`;
    const response = await fetch(url, {method: 'GET'});
    return response.json();
  }

  /* Add a message to the database
    * @param opts: {
    *   content: string,
    *   senderId: string (a valid user id),
    *   type: 'private' | 'channel',
    *   receiverId: string (a valid user id if type === 'private',
    *     a valid channel id if type === 'channel')
    * } */
  export async function add(opts: {
    content: string,
    senderId: string,
    type: 'private' | 'channel' | 'global',
    receiverId: string
  }) {
    const url = 'http://localhost:2000/message';
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(opts)
    });
    return response.json();
  }

  /* Remove a message from the database */
  export async function remove(id: string) {
    const url = `http://localhost:2000/message?id=${id}`;
    const response = await fetch(url, {method: 'DELETE'});
    return response.json();
  }

  /* Update a message in the database
    * only the content can be updated */
  export async function update(id: string, opts: {
    content?: string
  }) {
    const url = `http://localhost:2000/message?id=${id}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(opts)
    });
    return response.json();
  }

}
