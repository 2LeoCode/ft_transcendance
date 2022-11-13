import React from 'react';
import { Channel, ChannelCom } from '../com/channel.com';

export default function Channels() {
  let [channels, setChannels] = React.useState<Channel[]>([]);

  React.useEffect(() => {
    (async () => {
      setChannels(await ChannelCom.get({}));
    })();
  }, [channels]);

  return (
    <>
      <h3>Channels</h3>
      <ul className='channel_list'>
        {
          channels.map((channel: Channel) => (
            channel.isPrivate ? (<></>) : (
              <li>
                <div>{channel.name}</div>
              </li>
            )
          ))
        }
      </ul>
      <h4 className="create_channel">Create Channel</h4>
    </>
  );
}
