import React from "react";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import { useState } from "react";

const userIds = ["roy", "jay"];
const getRandomUserId = () => userIds[Math.round(Math.random())];

const originalMsgs = Array(50)
  .fill(0)
  .map((_, idx) => ({
    id: 50 - idx,
    userId: getRandomUserId(),
    timestamp: 1234567890123 + idx * 1000 * 60,
    text: `${50 - idx} mock text`,
  }));

function MsgList() {
  const [msgs, setMsgs] = useState(originalMsgs);
  const onCreate = (text) => {
    const newMsg = {
      id: msgs.length + 1,
      userId: getRandomUserId(),
      timestamp: Date.now(),
      text: `${msgs.length + 1} ${text}`,
    };
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = (text, id) => {
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1, {
        ...msgs[targetIndex],
        text,
      });
      return newMsgs;
    });
  };
  return (
    <>
      <MsgInput mutate={onCreate} />
      <ul className="messages">
        {msgs.map((msg) => (
          <MsgItem key={msg.id} {...msg} onUpdate={onUpdate} />
        ))}
      </ul>
    </>
  );
}

export default MsgList;
