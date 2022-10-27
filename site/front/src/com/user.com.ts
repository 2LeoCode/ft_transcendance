import { Channel } from './channel.com';
import { Message } from './message.com';
import { hash }from 'bcrypt';
import { Checker } from '../checker/checker';

const fetch = (url: RequestInfo, init?: RequestInit) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url, init));

export interface User {
  id: string;
  nick: string;
  mail: string;
  firstName: string;
  lastName: string;
  password: string;
  highestScore: number;
  scoreHistory: number;
  active: boolean;
  friends: User[];
  ownedChannels: Channel[];
  messagesIn: Message[];
  messagesOut: Message[];
  channels: Channel[];
}

export namespace UserCom {

  export async function get(opts: {
    id?: string,
    nick?: string,
    mail?: string,
    active?: string
  }) {
    let url = 'http://localhost:3000/user?';
    for (const key in opts)
      url += `${key}=${opts[key]}&`;
    const response = await fetch(url, {method: 'GET'});
    return response.json();
  }

  export async function add(opts: {
    nick: string,
    mail: string,
    firstName: string,
    lastName: string,
    password: string
  }) {
    if (!Checker.nickname(opts.nick))
      throw Error('Bad nickname');
    const url = 'http://localhost:3000/user';
    opts.password = await hash(opts.password, 10);
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(opts)
    });
    return response.json();
  }

  export async function remove(id: string) {
    const url = `http://localhost:3000/user?id=${id}`;
    const response = await fetch(url, {method: 'DELETE'});
    return response.json();
  }

  export async function update(id: string, opts: {
    nick?: string,
    mail?: string,
    firstName?: string,
    lastName?: string,
    password?: string,
    highestScore?: number,
    scoreHistory?: number[],
    active?: boolean,
    friends?: User[]
  }) {
    if (opts.nick !== undefined && !Checker.nickname(opts.nick))
      throw Error('Bad nickname');
    const url = `http://localhost:3000/user?id=${id}`;
    opts.password &&= await hash(opts.password, 10);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(opts)
    });
    return response.json();
  }

}
