import { useState, useEffect, useCallback, useRef } from "react";

function useInfiniteScroll(targetEl) {
  const observerRef = useRef(null);
  const [intersecting, setIntersecting] = useState(false);

  // const observer = new IntersectionObserver((entries) =>
  //   setIntersecting(
  //     // 하나라도 intersecting하면 true, 아니면 false
  //     entries.some((entry) => entry.isIntersecting)
  //   )
  // );

  const getObserver = useCallback(() => {
    // 최초로 1번 실행됨. (observerRef가 없을때만)
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) =>
        setIntersecting(
          // 하나라도 intersecting하면 true, 아니면 false
          entries.some((entry) => entry.isIntersecting)
        )
      );
    }
    return observerRef.current;
  }, [observerRef.current]);

  useEffect(() => {
    // targetEl.current가 있을 때만 감시.
    if (targetEl.current) getObserver().observe(targetEl.current);
    // 무한스크롤이 화면상에 존재하지 않게 되면 disconnect()
    return () => {
      getObserver().disconnect();
    };
  }, [targetEl.current]);
  return intersecting;
}

export default useInfiniteScroll;
