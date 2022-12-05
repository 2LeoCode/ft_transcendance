const Constants = Object.seal({
  jwtToken:
    document.cookie
    .split(';')
    .map(cookie =>
      cookie
        .split('=')
        .map(str => str.trim()))
    .find(cookie => cookie[0] === 'token')?.[1] || '',
  
  serverHost: 'http://localhost:2000'
});

export default Constants;