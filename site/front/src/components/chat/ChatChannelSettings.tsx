import { useAtom } from "jotai";
import { ChannelSettingsAtom } from "./ChatCurrentChannel";
import { useState } from "react";
import { ChannelVisibility } from "../../com/interfaces/public-channel.interface";
import ClientSocket from "../../com/client-socket";
import Channel from "../../com/interfaces/channel.interface";
import { Atom } from "../../com/types/atom.type";
import { NullAtom } from "./ChatCurrentConv";
import Swal from "sweetalert2";

const ChatChannelSettings = () => {
  const [channelSettings, setChannelSettings] = useAtom(ChannelSettingsAtom);
  const [currentVisibility] = useAtom(channelSettings?.visibilityAtom || NullAtom);
  const [channelNameInput, setChannelNameInput] = useState('');
  const [channelPasswordInput, setChannelPasswordInput] = useState('');
  const [channelVisibilityInput, setChannelVisibilityInput] = useState(currentVisibility as ChannelVisibility);

  return (
    <div className='ChatChannelSettings'>
      <h3>Channel Settings</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!channelNameInput.length) {
            Swal.fire({
              icon: 'error',
              text: "ChannelName cannot be empty",
            });
            return;
          }
          ClientSocket.emit('updateChannel', channelSettings?.id, {
            name: channelNameInput,
            password: channelPasswordInput,
            visibility: channelVisibilityInput,
          });
          setChannelSettings(null);
          setChannelNameInput('');
          setChannelPasswordInput('');
        }}>
        <input
          type='text'
          placeholder='name'
          value={channelNameInput}
          onChange={(e) => setChannelNameInput(e.target.value)} />
        <input
          type='text'
          placeholder='password'
          value={channelPasswordInput}
          onChange={(e) => setChannelPasswordInput(e.target.value)} />
        <select
          value={channelVisibilityInput}
          onChange={(e) => setChannelVisibilityInput(e.target.value as ChannelVisibility)}>
          <option value='visible'>Visible</option>
          <option value='hidden'>Hidden</option>
        </select>
        <br />
        <input type='submit' value='Save' />
      </form>
      <button
        style={{ width: '75px' }}
        onClick={() => {
          setChannelSettings(null);
          setChannelNameInput('');
          setChannelPasswordInput('');
        }}
      >
        Back
      </button>
    </div>
  );
}

export default ChatChannelSettings;
