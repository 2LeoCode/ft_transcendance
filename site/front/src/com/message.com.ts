import { Channel } from "./channel.com";
import { User } from "./user.com";

export interface Message {
  id: string;
  content: string;
  createDate: Date;
  updateDate: Date;
  sender: User;
  type: 'private' | 'channel';
  channelReceiver: Channel;
  userReceiver: User;
}

export namespace MessageCom {

  export async function get(opts: {
    id?: string,
    createDate?: Date,
    updateDate?: Date,
    senderId?: string,
    type?: 'private' | 'channel',
    receiverId?: string
  }) {
    let url = 'http://localhost:3000/message?';
    for (const key in opts)
      url += `${key}=${opts[key]}&`;
    const response = await fetch(url, {method: 'GET'});
    return response.json();
  }

  export async function add(opts: {
    content: string,
    senderId: string,
    type: 'private' | 'channel',
    receiverId: string
  }) {
    const url = 'http://localhost:3000/message';
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(opts)
    });
    return response.json();
  }

  export async function remove(id: string) {
    const url = `http://localhost:3000/message?id=${id}`;
    const response = await fetch(url, {method: 'DELETE'});
    return response.json();
  }

  export async function update(id: string, opts: {
    content?: string
  }) {
    const url = `http://localhost:3000/message?id=${id}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(opts)
    });
    return response.json();
  }

}