import React from 'react';
import '../styles/CreateChannel.css';

function CreateChannel(props: any) {
  const createChannel = (e: any) => {
    e.preventDefault();
    props.socket.emit('ChannelRoom', e.target[0].value); // load dm room with e.currentTarget.value and socketProps.socketId
    //console.log('Channel created ' + e.target[0].value);
    //console.log(e.target[0].value);
    props.isOn(false);
  };
  return (
    <div className="CreateChannel">
      <form onSubmit={createChannel}>
        <input
          type="text"
          placeholder="Channel Name"
        />
        <input type="text" placeholder="Password (optional)" />
        <br />
		<input type="radio" id="public" name="visibility" value="public" />
        <label htmlFor="public">public</label>
        <br />
        <input type="radio" id="private" name="visibility" value="private" />
        <label htmlFor="private">private</label>
        <br />
        <button type="submit">Create Channel</button>
      </form>
      <br />
      <button type="button" onClick={() => props.isOn(false)}>
        Close
      </button>
    </div>
  );
}

export default CreateChannel;
