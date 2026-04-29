import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Footer } from './components/Footer';
import { Background } from './components/Background';
import { MobileMenu } from './components/Menu';
import { useAuthStore } from './features/AuthStore';
import { motion, type Variants } from 'framer-motion';
import { Api } from './features/Api';

type Achievement = {
  id: number;
  title: string;
  description: string;
  image_link: string;
  date: string;
};

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const childFadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const childFadeLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const childFadeRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function App() {
  const savedSeconds = () => {
    const saved = localStorage.getItem('site_time');
    return saved ? Number(saved) || 0 : 0;
  };
  const [time, setTime] = useState<number>(() => savedSeconds());
  const lastSyncedSecondsRef = useRef(time);
  const syncInFlightRef = useRef(false);
  const currentTimeRef = useRef(time);
  const user = useAuthStore((s: any) => s.user);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [XP, setXP] = useState(0)

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const [achievementsError, setAchievementsError] = useState<string | null>(null);

  useEffect(() => {
    loadAchievements();
    loadXP()
  }, []);

  async function loadAchievements() {
    setAchievementsLoading(true);
    setAchievementsError(null);
    try {
      const data = await Api.getAchievements();
      setAchievements(data || []);
    } catch (error) {
      console.error('Ошибка загрузки достижений:', error);
      setAchievementsError('Не удалось загрузить достижения');
      setAchievements([]);
    } finally {
      setAchievementsLoading(false);
    }
  }

  async function loadXP() {
    try {
      const score = await Api.scoreMe()
      setXP(score)
    } catch {
      alert("Не удалось загрузить XP")
    }
  }

  useEffect(() => {
    document.title = 'Space-rus: Личный кабинет';
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        const next = prev + 1;
        currentTimeRef.current = next;
        localStorage.setItem('site_time', String(next));
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const serverSeconds = await Api.getTime();

        setTime(serverSeconds);
        localStorage.setItem('site_time', String(serverSeconds));

        lastSyncedSecondsRef.current = serverSeconds;
      } catch (e) {
        console.error('sync error', e);

        const local = savedSeconds();
        setTime(local);
        lastSyncedSecondsRef.current = local;
      }
    })();
  }, []);

  useEffect(() => {
    const SYNC_INTERVAL = 180000;

    const id = setInterval(async () => {
      const current = currentTimeRef.current;
      const delta = current - lastSyncedSecondsRef.current;

      if (delta < 180 || syncInFlightRef.current) return;

      syncInFlightRef.current = true;

      try {
        await Api.updateTime(delta);
        lastSyncedSecondsRef.current = current;
      } catch (e) {
        console.error('sync error', e);
      } finally {
        syncInFlightRef.current = false;
      }
    }, SYNC_INTERVAL);

    return () => clearInterval(id);
  }, []);

  const handleLogout = async () => {
    await Api.logout();
    window.location.reload();
  };

  async function updateImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    try {
      await Api.update(user.id, file);
      window.location.reload();
    } catch (error: any) {
      alert('Не удалось загрузить изображение');
    } finally {
      e.target.value = '';
    }
  }

  const profileImageSrc = user?.profile_picture
    ? `${import.meta.env.VITE_API_URL}/uploads/${user.profile_picture}`
    : null;

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col items-center py-6 sm:py-10 px-3 sm:px-6 text-white font-gothic selection:bg-blue-500 selection:text-white">
      <Background />
      <MobileMenu />

      <motion.div className="absolute inset-0 pointer-events-none overflow-hidden" initial={false} id='main'>
        <motion.div
          animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.04, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.12, 0.3, 0.12], scale: [1, 1.05, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-48 -right-24 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.25, 0.1], scale: [1, 1.03, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"
        />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl bg-[#0b1a40]/95 backdrop-blur-md rounded-[30px] sm:rounded-[40px] border border-blue-900/50 shadow-2xl relative z-10 p-5 sm:p-8 md:p-10 flex flex-col gap-8 md:gap-10"
      >
        <div className="flex flex-col xl:flex-row justify-between gap-8 xl:gap-10">
          <motion.div
            variants={childFadeLeft}
            className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-center sm:items-start text-center sm:text-left"
          >
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={updateImage} />

            <motion.div
              className="relative w-fit group cursor-pointer shrink-0"
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
            >
              {profileImageSrc ? (
                <motion.img
                  className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 object-cover rounded-[2rem] shadow-2xl border-2 border-blue-500/20"
                  src={profileImageSrc}
                  alt="Profile"
                  variants={{
                    hover: { scale: 1.02, filter: 'brightness(0.95)' },
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                />
              ) : (
                <motion.div
                  className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-[2rem] shadow-2xl border-2 border-blue-500/20 bg-slate-800/60 flex items-center justify-center text-white/80 text-sm sm:text-base"
                  variants={{
                    hover: { scale: 1.02, filter: 'brightness(0.95)' },
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  Нет фото
                </motion.div>
              )}

              <motion.div
                className="absolute inset-0 rounded-[2rem] flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <span className="text-white text-lg font-semibold">Загрузить</span>
              </motion.div>
            </motion.div>

            <motion.div variants={childFadeUp} className="flex flex-col items-center sm:items-start gap-2 sm:gap-3 mt-2 sm:mt-0">
              <motion.h1
                className="title font-semibold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              >
                Привет, {user?.firstname ?? 'Пользователь'}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
                className="bg-[#5c9cff] text-white px-6 sm:px-8 py-1.5 rounded-full w-max font-medium shadow-md tracking-wide text-sm sm:text-base"
              >
                {user?.email ?? ''}
              </motion.div>

              <div className="flex h-7 sm:h-8 w-40 sm:w-48 rounded-full overflow-hidden border border-[#5c9cff] bg-transparent mt-2 text-xs sm:text-sm relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '50%' }}
                  transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                  className="bg-[#5c9cff] flex items-center justify-center transform -skew-x-12 translate-x-[-10px]"
                >
                  <span className="transform skew-x-12 pl-3">XP</span>
                </motion.div>
                <div className="w-1/2 flex items-center justify-center transform -skew-x-12">
                  <span className="transform skew-x-12">{XP}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={childFadeRight} className="flex-1 w-full xl:max-w-[28rem] relative mt-4 xl:mt-0">


            <div className="absolute -top-12 sm:-top-14 right-0 flex gap-3 z-20">
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: '#fff', color: '#dc2626' }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                onClick={handleLogout}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-[#eef4fc] rounded-full flex items-center justify-center shadow-lg text-blue-600 transition-all"
                title="Выйти"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </motion.button>
            </div>

            <div className="bg-[#071533]/55 border border-blue-900/35 rounded-[28px] p-4 sm:p-5 shadow-inner h-full overflow-hidden">
              <div className="flex items-center justify-between gap-3 mb-4">
                <motion.h2
                  className="subtitle text-center sm:text-left"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                >
                  Достижения:
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
                  className="px-3 py-1 rounded-full bg-[#5c9cff]/15 border border-[#5c9cff]/30 text-xs sm:text-sm text-[#d9e7ff] whitespace-nowrap"
                >
                  {achievements.length} шт.
                </motion.div>
              </div>

              <div className="overflow-x-auto pb-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-500/20">
                {achievementsLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : achievements.length === 0 ? (
                  <p className="text-white/50 text-sm italic text-center py-4">Нет достижений</p>
                ) : (
                  <div className="flex gap-3 min-w-max pr-2 m-1">
                    {achievements.map((item: Achievement, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 * index, ease: 'easeOut' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm w-36 sm:w-40 shrink-0 cursor-pointer"
                      >
                        <div className="relative h-24">
                          <motion.img
                            src={item.image_link}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a40] via-[#0b1a40]/40 to-transparent" />
                          <div className="absolute inset-x-0 bottom-2 px-3">
                            <div className="text-sm font-semibold leading-tight truncate">{item.title}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={childFadeUp} className="flex flex-col md:flex-row justify-between items-center md:items-end mt-4 gap-8 md:gap-0">
          <div className="flex flex-col items-center md:items-end md:pr-4 justify-start">
            <h2 className="subtitle text-white m-1 md:w-100">Общее время на сайте:</h2>
            <motion.div
              key={time}
              initial={{ scale: 1.02, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="md:w-100 text-red-600 title font-light flex items-baseline gap-1 sm:gap-2 drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]"
            >
              <motion.span key={`${Math.floor(time / 3600)}-h`}>{Math.floor(time / 3600)}</motion.span>
              <span className="text-sm sm:text-lg font-normal">ч.</span>
              <motion.span key={`${Math.floor((time % 3600) / 60)}-m`}>{Math.floor((time % 3600) / 60)}</motion.span>
              <span className="text-sm sm:text-lg font-normal">мин.</span>
              <motion.span key={`${time % 60}-s`}>{time % 60}</motion.span>
              <span className="text-sm sm:text-lg font-normal">сек.</span>
            </motion.div>
          </div>
        </motion.div>

        <div className="w-full overflow-hidden">
          <motion.div
            className="flex items-center justify-between gap-3 mb-4"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <h2 className="subtitle text-center sm:text-left">Подробнее о достижениях:</h2>
            <div className="px-3 py-1 rounded-full bg-[#5c9cff]/15 border border-[#5c9cff]/30 text-xs sm:text-sm text-[#d9e7ff] whitespace-nowrap">
              {achievements.length} записей
            </div>
          </motion.div>

          {achievementsLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : achievementsError ? (
            <div className="text-center py-8">
              <p className="text-red-400">{achievementsError}</p>
              <button
                onClick={loadAchievements}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition"
              >
                Попробовать снова
              </button>
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-center py-8 text-white/50 italic">
              У вас пока нет достижений. Пройдите тесты, чтобы их получить!
            </div>
          ) : (
            <motion.div
              className="max-h-[44rem] overflow-y-auto pr-2 grid grid-cols-1 lg:grid-cols-2 gap-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-500/20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.08, delayChildren: 0.1 },
                },
              }}
            >
              {achievements.map((item: Achievement) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.98 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.5, ease: 'easeInOut' },
                    },
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm m-3"
                >
                  <div className="relative flex flex-col sm:flex-row gap-0 sm:gap-4">
                    <div className="relative w-full sm:w-44 h-40 sm:h-auto shrink-0 overflow-hidden">
                      <motion.img
                        src={item.image_link}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#0b1a40] via-[#0b1a40]/30 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 sm:hidden">
                        <div className="text-xs uppercase tracking-[0.24em] text-white/75">{item.title}</div>
                      </div>
                    </div>

                    <div className="flex-1 p-4 sm:py-4 sm:pr-4 sm:pl-0 relative">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex px-3 py-1 rounded-full bg-white/8 text-white/80 text-[11px] sm:text-xs">
                            {new Date(item.date).toLocaleString()}
                          </span>
                        </div>

                        <motion.h3 className="text-base sm:text-lg font-bold leading-tight title">
                          {item.title}
                        </motion.h3>

                        <motion.p className="text-sm sm:text-[15px] leading-snug text-white/85 max-w-none description">
                          {item.description}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}