export default interface Image {
	id: string,
	filename: string,
	mimetype: string,
	buffer: {
		data: number[],
		type: 'Buffer',
	},
}