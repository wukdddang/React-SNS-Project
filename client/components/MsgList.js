import React from "react";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import fetcher from "../fetcher";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const userIds = ["roy", "jay"];
// const getRandomUserId = () => userIds[Math.round(Math.random())];
function MsgList() {
  const {
    query: { userId = "" },
  } = useRouter();
  const [msgs, setMsgs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

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
    const newMsgs = await fetcher("get", "/messages", {
      // 커서값이 마지막 데이터의 id를 가리켜줌
      // 최초에는 값이 없기 때문에 ?. ||를 사용
      params: { cursor: msgs[msgs.length - 1]?.id || "" },
    });
    if (newMsgs.length === 0) {
      setHasNext(false);
      return;
    }
    setMsgs((msgs) => [...msgs, ...newMsgs]);
  };
  // useEffect 내부에서는 async await를 직접 호출하지 않게끔 한다
  // 따라서 외부에서 선언한 비동기 함수를 실행

  // 맨 처음에는 데이터가 없다.
  // 그래서 intersecting이 무조건 true라서 message가 두번 요청된다.
  // useEffect(() => {
  //   getMessages();
  // }, []);

  useEffect(() => {
    if (intersecting && hasNext) getMessages();
  }, [intersecting]);
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
      <div ref={fetchMoreEl} style={{ width: "100%", height: "30px" }}></div>
    </>
  );
}

export default MsgList;
