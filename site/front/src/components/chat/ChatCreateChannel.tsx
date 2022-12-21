import { useAtom } from "jotai";
import { useState } from "react";
import ClientSocket from "../../com/client-socket";
import { ChannelAccessibility, ChannelVisibility } from "../../com/interfaces/public-channel.interface";
import useDatabase from "../../com/use-database";
import { CurrentChannelAtom } from "./ChatChannel";
import { CreateChannelAtom } from "./ChatChannelList";
import swal from "sweetalert";
import Swal from "sweetalert2";

const ChatCreateChannel = () => {
	const db = useDatabase();
	const [myChannels, setMyChannels] = useAtom(db.user.ownedChannelsAtom);
	const [visibleChannels, setVisibleChannels] = useAtom(db.visibleChannelsAtom);
	const [, setCreateChannel] = useAtom(CreateChannelAtom);
	const [inputName, setInputName] = useState<string>('');
	const [inputPassword, setInputPassword] = useState<string>('');
	const [inputVisibility, setInputVisibility] = useState<ChannelVisibility>('visible');
	//const [inputAccessibility, setInputAccessibility] = useState<ChannelAccessibility>('public');
	const [currentChannel, setCurrentChannel] = useAtom(CurrentChannelAtom);

	return (
		<div className='ChatCreateChannel'>
			<h2>Create Channel</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					if (!inputName.length) {
						Swal.fire({
							icon: 'error',
							text: 'Please enter a name',
						});
						return;
					}
					//if (inputVisibility == 'visible' && inputAccessibility == 'private') {
					//	swal('Visible channels cannot be private');
					//	return;
					//}
					ClientSocket.emit('createChannel',
						inputName, inputPassword,
						inputVisibility, 'public'
					);
				}
			}>
				<input
					type='text'
					value={inputName}
					placeholder='name'
					onChange={(e) => {
						e.preventDefault();
						setInputName(e.target.value);
					}} />
				<br />
				<input
					type='password'
					value={inputPassword}
					placeholder='password'
					onChange={(e) => {
						e.preventDefault();
						setInputPassword(e.target.value);
					}} />
				<br />
				<select
					value={inputVisibility}
					onChange={(e) => {
						e.preventDefault();
						setInputVisibility(e.target.value as ChannelVisibility);
					}}
				>
					<option value='visible'>Visible</option>
					<option value='hidden'>Hidden</option>
				</select>
				
				{/* <br />
				<select
					value={inputAccessibility}
					onChange={(e) => {
						e.preventDefault();
						setInputAccessibility(e.target.value as ChannelAccessibility);
					}}
				>
					<option value='public'>Public</option>
					<option value='private'>Private</option>
				</select> */}
				<button type='submit'>Create</button>
				<button
					onClick={(e) => {
						e.preventDefault();
						setCreateChannel(false);
					}}
				>
					Cancel
				</button>
			</form>
		</div>
	);
}

export default ChatCreateChannel;