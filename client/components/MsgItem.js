import MsgInput from "./MsgInput";

function MsgItem({ id, userId, timestamp, text, onUpdate, isEditing }) {
  return (
    <li className="messages__item">
      <h3>
        {userId}{" "}
        <sub>
          {new Date(timestamp).toLocaleString("ko-kr", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </sub>
      </h3>
      {isEditing ? (
        <>
          <MsgInput mutate={onUpdate} id={id} />
        </>
      ) : (
        text
      )}
    </li>
  );
}

export default MsgItem;
