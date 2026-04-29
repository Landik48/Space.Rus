import { motion } from "framer-motion";

export function Footer() {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mt-8 mb-8 pt-8 pb-12 sm:pb-8 flex flex-col md:flex-row justify-between items-center md:items-end relative gap-10 md:gap-8 w-full max-w-5xl mx-auto bg-gray-900/80 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-[30px] sm:rounded-[40px] border border-gray-800"
      >
        <div className="flex justify-center md:justify-start w-full md:w-auto">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            src="/icon.png"
            alt="Logo"
            className="w-32 sm:w-40 md:w-50"
          />
        </div>

        <div className="hidden sm:flex flex-col gap-2 text-gray-400 text-sm font-gothic text-center md:text-left pb-10">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="description"
          >
            Наши
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="description"
          >
            контакты
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="description"
          >
            скоро здесь
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="description"
          >
            будут
          </motion.h2>
        </div>

        <div className="flex flex-col items-center md:items-end text-center md:text-right max-w-xs relative mt-4 md:mt-0 w-full md:w-auto">
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            whileInView={{ rotate: 0, opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden sm:block absolute -top-14 right-10 md:right-0 text-white"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </motion.div>
          <motion.div
            initial={{ rotate: 180, opacity: 0 }}
            whileInView={{ rotate: 0, opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden sm:block absolute -top-5 right-0 md:-right-8 text-white scale-75"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="description font-gothic italic text-[#3b5998] mb-2 leading-snug sm:leading-tight sm:mt-6"
          >
            «Космос — это не прогулка,<br />ракета — не самолет»
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-[#3b5998] text-xs sm:text-sm font-semibold font-gothic"
          >
            Юрий Алексеевич Гагарин
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute bottom-4 w-full text-center text-[#3b5998] text-[10px] sm:text-xs font-gothic left-0"
        >
          «Космос.Rus», 2026
        </motion.div>
      </motion.div>
    </div>
  );
}