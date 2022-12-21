export const getCookie = (name: string) => (
	document.cookie
	.split(';')
	.map(cookie =>
		cookie
			.split('=')
			.map(str => str.trim()))
	.find(cookie => cookie[0] === name)?.[1] || ''
);


const Constants = Object.seal({
  jwtToken: getCookie('token'),
  jwtToken2fa: getCookie('token_2fa'),
  serverHost: 'http://localhost:2000'
});

export default Constants;