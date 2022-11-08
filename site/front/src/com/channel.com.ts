import { User } from "./user.com";
import { Message } from "./message.com";
import bcrypt from 'bcryptjs';
import { Checker } from "../checker/checker";

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

  /* Get channel(s) from the database
    * using the following optional filters:
    * id, name, isPrivate, ownerId */
  export async function get(opts: {
    id?: string,
    name?: string,
    isPrivate?: boolean,
    ownerId?: string
  }) {
    let url = 'http://localhost:2000/channel?';
    for (const key in opts)
      url += `${key}=${opts[key as keyof typeof opts]}&`;
    const response = await fetch(url, {method: 'GET'});
    return response.json();
  }

  /* Add a channel to the database
    * @param opts: {
    *   name: string (min 1, max 16, only letters, numbers and underscores),
    *   password: string (min 3, max 16, only printable characters),
    *   isPrivate: boolean (if true the channel won't appear in the channel list),
    *   ownerId: string (the channel's owner, a valid user id)
    * } */
  export async function add(opts: {
    name: string,
    password: string,
    isPrivate: boolean,
    ownerId: string
  }) {
    if (!Checker.channelName(opts.name))
      throw Error('Bad channel name');
    if (!Checker.channelPassword(opts.password))
      throw Error('Bad channel password');
    const url = 'http://localhost:2000/channel';
    opts.password = await bcrypt.hash(opts.password, 10);
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(opts)
    });
    return response.json();
  }

  /* Remove a channel from the database */
  export async function remove(id: string) {
    const url = `http://localhost:2000/channel?id=${id}`;
    const response = await fetch(url, {method: 'DELETE'});
    return response.json();
  }

  /* Update a channel in the database
    * @param opts: {
    *   name: string (min 1, max 16, only letters, numbers and underscores),
    *   password: string (min 3, max 16, only printable characters),
    *   isPrivate: string (if true the channel won't appear in the channel list),
    *   userIds: string[] (users present in the channel, a list of valid user ids)
    * } */
  export async function update(id: string, opts: {
    name?: string,
    password?: string,
    isPrivate?: string,
    userIds?: string[]
  }) {
    if (opts.name && !Checker.channelName(opts.name))
      throw Error('Bad channel name');
    if (opts.password && !Checker.channelPassword(opts.password))
      throw Error('Bad channel password');
    const url = `http://localhost:2000/channel?id=${id}`;
    if (opts.password !== undefined)
      opts.password = await bcrypt.hash(opts.password, 10);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(opts)
    });
    return response.json();
  }

}
