import { User } from "./user.com";
import { Message } from "./message.com";
import { hash } from 'bcrypt';

export interface Channel {
  id: string;
  name: string;
  password: string;
  isPrivate: string;
  owner: User;
  users: User[];
  messages: Message[];
}

export namespace ChannelCom {

  export async function get(opts: {
    id?: string,
    name?: string,
    isPrivate?: boolean,
    ownerId?: string
  }) {
    let url = 'http://localhost:3000/channel?';
    for (const key in opts)
      url += `${key}=${opts[key]}&`;
    const response = await fetch(url, {method: 'GET'});
    return response.json();
  }

  export async function add(opts: {
    name: string,
    password: string,
    isPrivate: boolean,
    ownerId: string
  }) {
    const url = 'http://localhost:3000/channel';
    opts.password = await hash(opts.password, 10);
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(opts)
    });
    return response.json();
  }

  export async function remove(id: string) {
    const url = `http://localhost:3000/channel?id=${id}`;
    const response = await fetch(url, {method: 'DELETE'});
    return response.json();
  }

  export async function update(id: string, opts: {
    name?: string,
    password?: string,
    isPrivate?: string,
    users?: User[]
  }) {
    const url = `http://localhost:3000/channel?id=${id}`;
    opts.password = await hash(opts.password, 10);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(opts)
    });
    return response.json();
  }

}