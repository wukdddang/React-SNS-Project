import React from "react";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import fetcher from "../fetcher";

const userIds = ["roy", "jay"];
// const getRandomUserId = () => userIds[Math.round(Math.random())];
function MsgList() {
  const {
    query: { userId = "" },
  } = useRouter();
  const [msgs, setMsgs] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const onCreate = async (text) => {
    const newMsg = await fetcher("post", "/messages", { text, userId });
    if (!newMsg) throw Error("메시지가 없습니다.");
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = async (text, id) => {
    // 서버에서 put 요청으로 가져오는 newMsg
    const newMsg = await fetcher("put", `/messages/${id}`, { text, userId });
    if (!newMsg) throw Error("메시지가 없습니다.");
    // setState를 함수형으로 사용하는 것을 추천
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1, newMsg);
      return newMsgs;
    });
    doneEdit();
  };

  const onDelete = async (id) => {
    const receivedId = await fetcher("delete", `/messages/${id}`, {
      params: { userId },
    });
    // const receivedId = await fetcher("delete", `/messages/${id}?userId=${userId}`);

    console.log(typeof receivedId, typeof id);
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === receivedId);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
  };

  // EDIT 완료되면 알려주는 메서드
  const doneEdit = () => setEditingId(null);
  // 메시지들을 가져오는 함수
  const getMessages = async () => {
    const msgs = await fetcher("get", "/messages");
    setMsgs(msgs);
  };
  // useEffect 내부에서는 async await를 직접 호출하지 않게끔 한다
  // 따라서 외부에서 선언한 비동기 함수를 실행
  useEffect(() => {
    getMessages();
  }, []);
  return (
    <>
      <MsgInput mutate={onCreate} />
      <ul className="messages">
        {msgs.map((msg) => (
          <MsgItem
            key={msg.id}
            {...msg}
            onUpdate={onUpdate}
            onDelete={() => onDelete(msg.id)}
            startEdit={() => setEditingId(msg.id)}
            isEditing={editingId === msg.id}
            myId={userId}
          />
        ))}
      </ul>
    </>
  );
}

export default MsgList;
