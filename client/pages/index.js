import MsgList from "../components/MsgList";
import React from "react";

function Home(props) {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }
  return (
    <>
      <h1>SIMPLE SNS</h1>
      <MsgList />
    </>
  );
}

export default Home;
