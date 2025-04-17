import { useRef } from "react";

export const useInfiniteScroll = ({ loading, hasMore, onLoadMore }: any) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = (node: HTMLElement | null) => {
    if (loading || !hasMore) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    if (node) observerRef.current.observe(node);
  };
  return lastElementRef;
};
