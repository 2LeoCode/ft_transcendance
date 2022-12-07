import Message from "../com/interfaces/message.interface";
import useDatabase from "../com/use-database";

const PrivateMessage = ({ message }: {
	message: {
		content: string,
		isOwn: boolean
	}
}) => {
	const db = useDatabase();

	return (
		<div className={
			`${message.isOwn ? 'own' : 'other'}_messages`
		}>
			{message.content}
		</div>
	);
}

export default PrivateMessage;