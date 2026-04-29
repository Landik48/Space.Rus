import { useEffect, useState } from 'react';

export type Recommendation = {
  id: number;
  title: string;
  description: string;
  img_link: string;
  article_link: string;
  test_id: number;
};

type FetchArticlesFn = (skip: number, take: number) => Promise<Recommendation[]>;

export function usePaginatedArticles(fetchArticles: FetchArticlesFn, take = 5) {
  const [items, setItems] = useState<Recommendation[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  async function load(initial = false) {
    if (loading) return;

    setLoading(true);
    try {
      const currentSkip = initial ? 0 : skip;
      const data = await fetchArticles(currentSkip, take);

      if (data.length < take) setHasMore(false);

      if (initial) {
        setItems(data);
        setSkip(take);
      } else {
        setItems((prev) => [...prev, ...data]);
        setSkip((prev) => prev + take);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(true);
  }, []);

  return {
    items,
    loading,
    hasMore,
    loadMore: () => load(false),
    reload: () => load(true),
  };
}