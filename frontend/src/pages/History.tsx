import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Background } from '../components/Background';
import { Footer } from '../components/Footer';
import { MobileMenu } from '../components/Menu';

const epochs = [
  { id: 'all', label: 'Все события' },
  { id: 'theory', label: 'Теория (1881–1929)' },
  { id: 'dawn', label: 'Первые ракеты (1933–1954)' },
  { id: 'golden', label: 'Золотой век (1957–1965)' },
  { id: 'stations', label: 'Эпоха станций (1967–1998)' },
  { id: 'modern', label: 'Современность (2011–2020)' },
];

export const History = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const [activeEpoch, setActiveEpoch] = useState('all');

  const historyEls = [
    {
      id: 1,
      date: '1881',
      title: 'Проект ракетного аппарата',
      description: 'Николай Кибальчич разрабатывает проект ракетного летательного аппарата.',
      epoch: 'theory',
      image: '/history_1.png',
    },
    {
      id: 2,
      date: '1883',
      title: '«Свободное пространство»',
      description: 'Циолковский пишет «Свободное пространство» — первый научный набросок жизни в невесомости.',
      epoch: 'theory',
      image: '/history_2.png',
    },
    {
      id: 3,
      date: '1897',
      title: 'Уравнение ракеты',
      description: 'Циолковский выводит формулу реактивного движения (уравнение ракеты).',
      epoch: 'theory',
      image: '/history_3.png',
    },
    {
      id: 4,
      date: '1903',
      title: 'Исследование мировых пространств',
      description: 'Циолковский публикует «Исследование мировых пространств реактивными приборами».',
      epoch: 'theory',
      image: '/history_4.png',
    },
    {
      id: 5,
      date: '1924',
      title: 'Создание ОИМС',
      description: 'Создано Общество изучения межпланетных сообщений (ОИМС) в Москве.',
      epoch: 'theory',
      image: '/history_5.png',
    },
    {
      id: 6,
      date: '1929',
      title: 'Проекты ЖРД Цандера',
      description: 'Фридрих Цандер разрабатывает проекты жидкостных ракетных двигателей.',
      epoch: 'theory',
      image: '/history_6.png',
    },
    {
      id: 7,
      date: '1933',
      title: 'Первые советские ракеты',
      description: 'Запуски ГИРД-09 и ГИРД-X — первые советские жидкостные ракеты.',
      epoch: 'dawn',
      image: '/history_7.png',
    },
    {
      id: 8,
      date: '1938',
      title: 'Арест Королёва',
      description: 'Сергей Королёв арестован и отправлен в ГУЛАГ — тяжёлый удар по программе.',
      epoch: 'dawn',
      image: '/history_8.png',
    },
    {
      id: 9,
      date: '1945',
      title: 'Трофейные технологии',
      description: 'СССР захватывает трофейные ракеты Фау-2 и специалистов в Германии.',
      epoch: 'dawn',
      image: '/history_9.png',
    },
    {
      id: 10,
      date: '1954',
      title: 'Проект первого спутника',
      description: 'Королёв предлагает проект первого искусственного спутника Земли.',
      epoch: 'dawn',
      image: '/history_10.png',
    },
    {
      id: 11,
      date: '1957',
      title: 'Первое животное в космосе',
      description: 'На орбиту отправилась Лайка, первое живое существо в космосе.',
      epoch: 'golden',
      image: '/history_11.png',
    },
    {
      id: 12,
      date: '1960',
      title: 'Белка и Стрелка',
      description: 'В космос летят собаки Белка и Стрелка и благополучно возвращаются.',
      epoch: 'golden',
      image: '/history_12.png',
    },
    {
      id: 13,
      date: '1961',
      title: 'Первый человек в космосе',
      description: 'Юрий Гагарин. 108 минут полёта на «Востоке-1». Первый человек в космосе.',
      epoch: 'golden',
      image: '/history_13.png',
    },
    {
      id: 14,
      date: '1965',
      title: 'Выход в открытый космос',
      description: 'Алексей Леонов выходит в открытый космос впервые в истории.',
      epoch: 'golden',
      image: '/history_14.png',
    },
    {
      id: 15,
      date: '1967',
      title: 'Трагедия «Союза-1»',
      description: 'Владимир Комаров погиб при посадке «Союза-1» — отказал парашют.',
      epoch: 'stations',
      image: '/history_15.png',
    },
    {
      id: 16,
      date: '1971',
      title: 'Орбитальная станция «Салют-1»',
      description: '«Союз-11» доставляет экипаж на первую в мире орбитальную станцию «Салют-1». Все трое погибают при возвращении из-за разгерметизации.',
      epoch: 'stations',
      image: '/history_16.png',
    },
    {
      id: 17,
      date: '1975',
      title: '«Союз — Аполлон»',
      description: 'Советский и американский корабли состыковались на орбите.',
      epoch: 'stations',
      image: '/history_17.png',
    },
    {
      id: 18,
      date: '1978 - 1988',
      title: 'Программа «Интеркосмос»',
      description: 'На советские станции полетели космонавты из соцстран: Чехословакии, Польши, ГДР, Кубы, Франции, Индии.',
      epoch: 'stations',
      image: '/history_18.png',
    },
    {
      id: 19,
      date: '1986',
      title: 'Модульная станция «Мир»',
      description: 'Новая модульная станция, которую собирали прямо на орбите, добавляя блок за блоком.',
      epoch: 'stations',
      image: '/history_19.png',
    },
    {
      id: 20,
      date: '1995',
      title: 'Рекорд Валерия Полякова',
      description: 'Валерий Поляков провёл на «Мире» 437 суток подряд — абсолютный рекорд, который не побит до сих пор.',
      epoch: 'stations',
      image: '/history_20.png',
    },
    {
      id: 21,
      date: '1998',
      title: 'Начало сборки МКС',
      description: 'Россия запустила «Зарю» — первый блок Международной космической станции.',
      epoch: 'stations',
      image: '/history_21.png',
    },
    {
      id: 22,
      date: '2011 - 2020',
      title: 'Монополия «Союзов»',
      description: 'После закрытия программы Space Shuttle NASA платило России за каждое кресло на «Союзе» — порядка 80 миллионов долларов.',
      epoch: 'modern',
      image: '/history_22.png',
    },
    {
      id: 23,
      date: '2020',
      title: 'SpaceX Crew Dragon',
      description: 'SpaceX с кораблём Crew Dragon начал возить астронавтов на МКС. Россия перестала быть незаменимой.',
      epoch: 'modern',
      image: '/history_23.png',
    },
  ];

  const filteredHistory =
    activeEpoch === 'all'
      ? historyEls
      : historyEls.filter((event) => event.epoch === activeEpoch);

  useEffect(() => {
    document.title = 'Space-rus: Историческая хронология';
  }, []);

  return (
    <>
      <Background />
      <MobileMenu />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full mt-32 mb-10 px-4"
      >
        <h1 className="title mb-8 text-center text-3xl md:text-4xl font-bold text-white">
          Историческая хронология
        </h1>

        <div className="max-w-4xl mx-auto mb-8 flex flex-wrap justify-center gap-2 md:gap-4 relative z-20">
          {epochs.map((epoch) => (
            <button
              key={epoch.id}
              onClick={() => setActiveEpoch(epoch.id)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeEpoch === epoch.id
                  ? 'text-white'
                  : 'text-blue-200 hover:text-white bg-[#0b1a40]/60'
              }`}
            >
              {activeEpoch === epoch.id && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10">{epoch.label}</span>
            </button>
          ))}
        </div>

        <div className="relative h-[600px] rounded-4xl inset-shadow-[0px_0px_135px_rgba(0,0,0,0.5)] overflow-hidden">
          <div
            ref={containerRef}
            className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-500/40 z-10"
          >
            <div className="relative py-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto min-h-full flex flex-col justify-start">
              <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2">
                <div className="relative h-full w-full bg-blue-900/30">
                  <motion.div
                    style={{ scaleY: scrollYProgress }}
                    className="absolute inset-0 origin-top bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-600 shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                  />
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {filteredHistory.map((event, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                      transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                      key={event.id}
                      className="relative flex items-center py-6 w-full"
                    >
                      <div className="absolute left-[28px] md:left-1/2 -translate-x-1/2 w-4 h-4 z-20">
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ root: containerRef, once: false, margin: '-40px' }}
                          transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.1 }}
                          className="absolute inset-0 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]"
                        />
                        <div className="absolute inset-0 rounded-full border-[3px] border-[#060d20]" />
                      </div>

                      <div
                        className={`w-full pl-[64px] md:pl-0 md:w-[calc(50%-2rem)] ${
                          isEven ? 'md:mr-auto' : 'md:ml-auto'
                        }`}
                      >
                        <motion.div
                          initial={{ opacity: 0, x: isEven ? -40 : 40, scale: 0.93 }}
                          whileInView={{ opacity: 1, x: 0, scale: 1 }}
                          viewport={{ root: containerRef, once: false, margin: '-40px' }}
                          transition={{ type: 'spring', stiffness: 240, damping: 22, delay: 0.05 }}
                          whileHover={{
                            scale: 1.02,
                            borderColor: 'rgba(34,211,238,0.5)',
                            backgroundColor: 'rgba(11,26,64,1)',
                            transition: { type: 'spring', stiffness: 300, damping: 20 },
                          }}
                          className="bg-[#0b1a40]/70 backdrop-blur-md rounded-2xl border border-blue-500/20 p-5 sm:p-6 shadow-2xl"
                        >
                          {event.image && (
                            <div className="w-full h-44 sm:h-48 rounded-xl overflow-hidden border border-white/5 relative group bg-[#060d20] mb-5">
                              <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#060d20]/60 to-transparent" />
                            </div>
                          )}

                          <div className="min-w-0 text-left">
                            <div className="mb-3">
                              <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-900/40 px-3 py-1.5 rounded-md border border-cyan-500/30 inline-block shadow-inner">
                                {event.date}
                              </span>
                            </div>
                            <h3 className="title text-lg sm:text-xl font-bold mb-2 break-words text-white leading-tight">
                              {event.title}
                            </h3>
                            <p className="description text-sm text-blue-100/70 break-words leading-relaxed">
                              {event.description}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};