export namespace Checker {

  export const nickname = (s: string): boolean =>
    /^[a-z_]\w{,15}$/gi.test(s);

   export const mail = (s: string): boolean =>
     /^[a-z0-9._%+-]{1,64}@[a-z0-9.-]{1,64}\.[a-z]{2,4}$/gi.test(s);

   export const userPassword = (s: string): boolean =>
     /^\w{8,16}$/gi.test(s);

   export const channelName = (s: string): boolean =>
     nickname(s);

   export const channelPassword = (s: string): boolean =>
     /^\w{3,16}$/gi.test(s);
}
