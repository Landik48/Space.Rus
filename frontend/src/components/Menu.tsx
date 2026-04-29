import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";

type NavNode = {
  path: string;
  label: string;
  top: string;
  left?: string;
  right?: string;
  size: string;
  planet: string;
  glow: string;
  ring?: boolean;
  delay: number;
};

const nodes: NavNode[] = [
  {
    path: "/",
    label: "Главное",
    top: "130px",
    // ✅ Фикс 1: убраны left/right — центрируем явно через left: "50%"
    size: "w-16 h-16",
    planet: "bg-[radial-gradient(circle_at_30%_30%,#fff7ed,#fb923c,#7c2d12)]",
    glow: "bg-orange-300/50",
    ring: true,
    delay: 0,
  },
  {
    path: "/articles",
    label: "Статьи",
    top: "280px",
    left: "50px",
    size: "w-10 h-10",
    planet: "bg-[radial-gradient(circle_at_30%_30%,#e0f2fe,#38bdf8,#0c4a6e)]",
    glow: "bg-sky-300/50",
    delay: 0.12,
  },
  {
    path: "/scores",
    label: "Рейтинг",
    top: "370px",
    right: "45px",
    size: "w-12 h-12",
    planet: "bg-[radial-gradient(circle_at_30%_30%,#ede9fe,#a78bfa,#4c1d95)]",
    glow: "bg-violet-300/50",
    delay: 0.24,
  },
  {
    path: "/history",
    label: "Хронология",
    top: "500px",
    left: "70px",
    size: "w-8 h-8",
    planet: "bg-[radial-gradient(circle_at_30%_30%,#dcfce7,#4ade80,#14532d)]",
    glow: "bg-emerald-300/50",
    delay: 0.36,
  },
];

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.4, delay: 0.1 } },
};

const panelVariants: Variants = {
  hidden: { x: "-100%", opacity: 0.6 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 28, mass: 0.9 },
  },
  exit: {
    x: "-100%",
    opacity: 0.4,
    transition: { type: "spring", stiffness: 320, damping: 32, mass: 0.8 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20, scale: 0.88 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { delay: 0.25 + delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: (delay: number) => ({
    opacity: 0,
    x: -16,
    scale: 0.94,
    transition: { duration: 0.2, delay: delay * 0.3, ease: "easeIn" },
  }),
};

const pathVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
  },
  exit: { pathLength: 0, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
};

const logoVariants: Variants = {
  hidden: { y: -20, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
  },
  exit: { y: -12, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

export const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflowY = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [isMenuOpen]);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setIsMenuOpen(false);
    setTimeout(() => setIsClosing(false), 550);
  }, [isClosing]);

  const handleNavigate = useCallback(
    (path: string) => {
      if (isClosing) return;
      setIsClosing(true);
      setIsMenuOpen(false);
      setTimeout(() => {
        navigate(path);
        setIsClosing(false);
      }, 420);
    },
    [isClosing, navigate]
  );

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 350, damping: 18 }}
        onClick={() => !isClosing && setIsMenuOpen(true)}
        className="fixed top-4 left-4 z-20 p-2.5 bg-[#0b1a40]/95 border border-blue-900/50 rounded-2xl shadow-lg text-white backdrop-blur-sm"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </motion.button>

      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <>

            <motion.div
              key="overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-[98] bg-black/50 backdrop-blur-[3px]"
              onClick={handleClose}
            />

            <motion.div
              key="sidebar"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed left-0 top-0 bottom-0 z-[99] w-[300px] max-w-[85vw] bg-[#060f27] flex flex-col font-gothic overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(30,58,138,0.25)_0%,transparent_60%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(109,40,217,0.12)_0%,transparent_60%)] pointer-events-none" />

              <motion.button
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={handleClose}
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-5 right-5 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500/30 text-white transition-colors"
                style={{ fontSize: "22px", lineHeight: 1 }}
                aria-label="Close menu"
              >
                ✕
              </motion.button>


              <motion.div
                variants={logoVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative z-10 flex justify-center pt-8 pb-2"
              >

                <img src="/icon.png" alt="Logo" className="w-28 sm:w-32" />
              </motion.div>


              <div className="relative flex-1 overflow-hidden">

                <motion.svg
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  viewBox="0 0 300 580"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M150,10 Q150,70 150,100 C150,150 70,170 70,230 C70,290 230,290 230,350 C230,410 90,420 90,470 C90,520 200,530 200,570"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                    variants={pathVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  />
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
                      <stop offset="50%" stopColor="rgba(165,180,252,0.4)" />
                      <stop offset="100%" stopColor="rgba(74,222,128,0.3)" />
                    </linearGradient>
                  </defs>
                </motion.svg>


                {nodes.map((node) => (
                  <motion.button
                    key={node.path}
                    custom={node.delay}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={() => handleNavigate(node.path)}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.94 }}
                    className="absolute flex flex-col items-center cursor-pointer select-none will-change-transform"
                    style={{
                      top: node.top,
                      ...(node.path === "/"
                        ? { left: "50%", transform: "translateX(-50%)" }
                        : { left: node.left, right: node.right }),
                    }}
                  >
                    <div className="relative flex items-center justify-center">

                      <motion.div
                        aria-hidden="true"
                        animate={{ opacity: [0.4, 0.85, 0.4], scale: [1, 1.25, 1] }}
                        transition={{
                          duration: 3.5,
                          repeat: Infinity,
                          repeatType: "mirror",
                          ease: "easeInOut",
                          delay: node.delay,
                        }}
                        className={`absolute inset-[-14px] rounded-full blur-2xl ${node.glow}`}
                      />

                      <motion.div
                        animate={{ y: [0, -6, 0], rotate: [0, 3, -3, 0] }}
                        transition={{
                          duration: 4.0,
                          repeat: Infinity,
                          repeatType: "mirror",
                          ease: "easeInOut",
                          delay: node.delay,
                        }}
                        className={`${node.size} rounded-full ${node.planet} transform-gpu`}
                      />

                      {node.ring && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="absolute w-28 h-6 border-[3px] border-white/40 rounded-[50%] rotate-[20deg]"
                        />
                      )}
                    </div>

                    <motion.span
                      animate={{ opacity: [0.75, 1, 0.75] }}
                      transition={{
                        duration: 3.0,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                        delay: node.delay + 0.2,
                      }}
                      className="text-white mt-2.5 tracking-widest text-sm font-light text-center"
                    >
                      {node.label}
                    </motion.span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};