import React, { useRef } from 'react';

const ChannelsBody = ({ channels, renderChannel }) => {
  const channelsRef = useRef(null);

  return (
    <div
      className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      ref={channelsRef}
    >
      {channels.map((channel) => renderChannel(channel))}
    </div>
  );
};

export default ChannelsBody;
