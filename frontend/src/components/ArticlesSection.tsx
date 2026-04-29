import { AnimatePresence, motion } from 'framer-motion';
import { useTestStore } from '../features/TestsStore';
import { usePaginatedArticles, type Recommendation } from '../features/usePaginatedArticles';

type ArticlesListProps = {
  title: string;
  fetchArticles: (skip: number, take: number) => Promise<Recommendation[]>;
  showTestButton?: boolean;
  emptyText?: string;
};

export function ArticlesSection({
  title,
  fetchArticles,
  showTestButton = true,
  emptyText = 'Пока здесь пусто',
}: ArticlesListProps) {
  const openTest = useTestStore((s) => s.openTest);
  const { items, loading, hasMore, loadMore } = usePaginatedArticles(fetchArticles, 5);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="title text-center sm:text-left">{title}</h2>

      {items.length === 0 ? (
        <h3 className="description italic">{emptyText}</h3>
      ) : (
        <AnimatePresence mode="popLayout">
          {items.map((rec, index) => (
            <motion.div
              layout
              key={rec.id}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="bg-[#18264b] rounded-2xl p-2 sm:p-3 flex flex-col sm:flex-row gap-4 sm:pr-6 shadow-md overflow-hidden"
            >
              <motion.div
                className="w-full sm:w-48 h-40 sm:h-32 bg-[#eef4fc] rounded-xl text-slate-800 flex items-center justify-center font-medium shrink-0 relative overflow-hidden"
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{ opacity: [0.1, 0.25, 0.1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(92,156,255,0.15), rgba(255,255,255,0.35), rgba(92,156,255,0.12))',
                  }}
                />
                <img
                  src={rec.img_link}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={rec.title}
                  loading="lazy"
                />
              </motion.div>

              <div className="flex flex-col py-1 flex-1 relative px-2 sm:px-0">
                <h3 className="text-base sm:text-lg font-bold mb-1 title">{rec.title}</h3>
                <p className="description leading-snug opacity-90 pb-6 sm:pb-0">
                  {rec.description}
                </p>

                <div className="flex gap-6 mt-2 flex-wrap md:justify-start justify-center">
                  <motion.a
                    whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,73,182,0.5)' }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    href={rec.article_link}
                    className="bg-[#274168] hover:bg-[#0b1a40]/95 text-white px-4 py-1 rounded-full font-medium shadow-lg transition-colors flex items-center justify-center w-[200px]"
                  >
                    Читать подробнее
                  </motion.a>

                  {showTestButton ? (
                    <motion.button
                      whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,73,182,0.5)' }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      onClick={() => openTest(rec.test_id, () => console.log('Тест пройден!'))}
                      className="bg-[#274168] hover:bg-[#0b1a40]/95 text-white px-4 py-1 rounded-full font-medium shadow-lg transition-colors flex items-center justify-center w-[200px]"
                    >
                      Пройти тест
                    </motion.button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {hasMore && (
        <div className="flex justify-center mt-4">
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: '0px 0px 24px rgba(92, 156, 255, 0.55)' }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            onClick={loadMore}
            disabled={loading}
            className="bg-[#073d8f] disabled:opacity-50 text-white px-12 py-2.5 rounded-full font-medium transition-colors shadow-lg mb-5"
          >
            {loading ? 'Загрузка…' : 'Ещё!'}
          </motion.button>
        </div>
      )}
    </section>
  );
}