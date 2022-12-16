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
		<li className={
			`${message.isOwn ? 'own' : 'other'}_messages`
		}>
			{message.content}
		</li>
	);
}

export default PrivateMessage;