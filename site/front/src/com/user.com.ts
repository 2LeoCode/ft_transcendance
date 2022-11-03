import { Channel } from './channel.com';
import { Message } from './message.com';
import { hash }from 'bcrypt';
import { Checker } from '../checker/checker';
import fetch from 'node-fetch';

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

  /* Get user(s) from the database
    * using the following optional filters:
    * id, nick, mail, active */
  export async function get(opts: {
    id?: string,
    nick?: string,
    mail?: string,
    active?: string
  }) {
    let url = 'http://localhost:2000/user?';
    for (const key in opts)
      url += `${key}=${opts[key as keyof typeof opts]}&`;
    const response = await fetch(url, {method: 'GET'});
    return response.json();
  }

  /* Add a user to the database
    * @param opts: {
    *   nick: string (min 3, max 16, only letters, numbers and underscores),
    *   mail: string (max 64, valid mail),
    *   firstName: string,
    *   lastName: string,
    *   password: string (min 8, only printable characters)
    * } */
  export async function add(opts: {
    nick: string,
    mail: string,
    firstName: string,
    lastName: string,
    password: string
  }) {
    if (!Checker.nickname(opts.nick))
      throw Error('Bad nickname');
    if (!Checker.mail(opts.mail))
      throw Error('Bad mail');
    if (!Checker.userPassword(opts.password))
      throw Error('Bad password');
    const url = 'http://localhost:2000/user';
    opts.password = await hash(opts.password, 10);
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(opts)
    });
    return response.json();
  }

  /* Remove a user from the database */
  export async function remove(id: string) {
    const url = `http://localhost:2000/user?id=${id}`;
    const response = await fetch(url, {method: 'DELETE'});
    return response.json();
  }

  /* Update a user in the database
    * @param opts: {
    *   nick?: string (min 3, max 16, only letters, numbers and underscores,
    *     must start with a letter or an underscore),
    *   mail?: string (valid mail),
    *   firstName?: string,
    *   lastName?: string,
    *   password?: string (min 8, max 16, only printable characters),
    *   highestScore?: number (the user's highest score in pong),
    *   scoreHistory?: number (the user's score history in pong),
    *   active?: boolean (is the user online or not),
    *   friendIds?: string[],
    * }
    * Note: password is hashed before being sent to the server */
  export async function update(id: string, opts: {
    nick?: string,
    mail?: string,
    firstName?: string,
    lastName?: string,
    password?: string,
    highestScore?: number,
    scoreHistory?: number[],
    active?: boolean,
    friendIds?: string[]
  }) {
    if (opts.nick && !Checker.nickname(opts.nick))
      throw Error('Bad nickname');
    if (opts.password && !Checker.userPassword(opts.password))
      throw Error('Bad password');
    if (opts.mail && !Checker.mail(opts.mail))
      throw Error('Bad mail');
    const url = `http://localhost:2000/user?id=${id}`;
    //opts.password &&= await hash(opts.password, 10);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(opts)
    });
    return response.json();
  }

}
