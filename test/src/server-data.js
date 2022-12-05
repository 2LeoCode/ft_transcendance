const ServerData = {
  a: (async () =>
    new Promise((res) =>
      setTimeout(() => {
        res("Hello");
      }, 500)
    ))(),
  b: (async () =>
    new Promise((res) =>
      setTimeout(() => {
        res(42);
      }, 1000)
    ))(),
  c: (async () =>
    new Promise((res) =>
      setTimeout(() => {
        res("This is a message");
      }, 750)
    ))()
};

const syncServerData = async () => {
  ServerData.a = await ServerData.a;
  ServerData.b = await ServerData.b;
  ServerData.c = await ServerData.c;
};

export { ServerData, syncServerData };
