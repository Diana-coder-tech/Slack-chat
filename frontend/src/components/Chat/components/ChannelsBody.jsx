import React, { useEffect, useRef } from 'react';

const ChannelsBody = ({ channels, currentChannelId, renderChannel }) => {
  const channelsRef = useRef(null);

  useEffect(() => {
    if (currentChannelId !== null) {
      const activeChannelElement = channelsRef.current.querySelector(
        `[data-channel-id="${currentChannelId}"]`
      );

      if (activeChannelElement) {
        activeChannelElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentChannelId]);  // Отслеживаем только изменение currentChannelId

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
