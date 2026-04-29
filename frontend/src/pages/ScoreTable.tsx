import { motion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Api } from '../features/Api';
import { Footer } from '../components/Footer';
import { MobileMenu } from '../components/Menu';
import { Background } from '../components/Background';

type RatingUser = {
  firstname: string;
  lastname: string;
  profile_picture: string | null;
  xp: number;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 22, mass: 0.8 },
  },
};

export const ScoreTable = () => {
  const [users, setUsers] = useState<RatingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRating();
  }, []);

  const loadRating = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await Api.scores();
      setUsers(data);
    } catch (e) {
      console.error('Ошибка загрузки рейтинга:', e);
      setError('Не удалось загрузить рейтинг');
    } finally {
      setLoading(false);
    }
  };

  const getAvatarUrl = (profilePicture: string | null) => {
    if (!profilePicture) return null;
    return `${import.meta.env.VITE_API_URL}/uploads/${profilePicture}`;
  };

  return (
    <>
      <MobileMenu />
      <Background />
      <div className="w-full flex items-start justify-center px-4 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24, mass: 0.8 }}
          className="w-full max-w-5xl bg-[#0b1a40]/95 backdrop-blur-md rounded-[30px] sm:rounded-[40px] border border-blue-900/50 shadow-2xl relative z-10 p-5 sm:p-8 md:p-10 flex flex-col gap-8 md:gap-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="title mb-6 text-center"
          >
            Рейтинг пользователей (топ 25)
          </motion.h1>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-blue-900/40" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-blue-900/40 rounded w-1/3" />
                    <div className="h-3 bg-blue-900/40 rounded w-1/4" />
                  </div>
                  <div className="w-16 h-6 bg-blue-900/40 rounded-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <p className="text-red-400 mb-4">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadRating}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
              >
                Попробовать снова
              </motion.button>
            </motion.div>
          ) : users.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/50 italic py-8"
            >
              Пока нет данных о рейтинге
            </motion.p>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {users.map((user, index) => {
                const rank = index + 1;
                const avatarUrl = getAvatarUrl(user.profile_picture);
                return (
                  <motion.div
                    key={`${user.firstname}-${user.lastname}-${index}`}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.02,
                      y: -3,
                      backgroundColor: 'rgba(92, 156, 255, 0.12)',
                      borderColor: 'rgba(34, 211, 238, 0.45)',
                      boxShadow: '0 10px 30px -5px rgba(0,0,0,0.3), 0 0 15px rgba(34,211,238,0.18)',
                      transition: { type: 'spring', stiffness: 350, damping: 18 },
                    }}
                    className="flex items-center gap-3 sm:gap-5 p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/5 cursor-default"
                  >
                    <div className="w-8 sm:w-10 text-center font-bold text-lg sm:text-xl text-blue-300 shrink-0">
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                    </div>

                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-blue-400/50 bg-slate-800 flex-shrink-0">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={`${user.firstname} ${user.lastname}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/50 text-xl font-bold">
                          {user.firstname.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate description">
                        {user.firstname} {user.lastname}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="subtitle sm:text-xl font-bold">
                        {user.xp.toLocaleString()}
                      </div>
                      <div className="text-[10px] sm:text-xs text-blue-200/50 uppercase tracking-wider">
                        XP
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </>
  );
};
