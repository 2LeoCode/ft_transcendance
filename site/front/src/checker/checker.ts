export namespace Checker {
  export const nickname = (s: string): boolean =>
    s.length <= 16 && /^[a-z_]+\w*$/gi.test(s);
}
