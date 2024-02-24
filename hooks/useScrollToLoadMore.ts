import { useEffect } from 'react';

interface Params {
  loading: boolean | undefined,
  paging: number,
  currentHasNext: boolean
  onLoadMore: () => void
  offset?: number
}

export const useScrollToLoadMore = ({ loading, paging, currentHasNext, onLoadMore, offset = 800 }: Params) => {
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (
        scrollTop > scrollHeight - clientHeight - offset &&
        !loading &&
        paging &&
        onLoadMore &&
        currentHasNext
      ) {
        onLoadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, paging, currentHasNext]);
}