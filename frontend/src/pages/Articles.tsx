import { motion } from 'framer-motion';
import { Background } from '../components/Background';
import { MobileMenu } from '../components/Menu';
import { Footer } from '../components/Footer';
import { TestModal } from '../components/TestModal';
import { ArticlesSection } from '../components/ArticlesSection';
import { Api } from '../features/Api';
import { useEffect } from 'react';

export function Articles() {
  useEffect(() => {
    
  })
  return (
    <>
      <MobileMenu />
      <Background />

      <div className="w-full flex items-start justify-center px-4 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl bg-[#0b1a40]/95 backdrop-blur-md rounded-[30px] sm:rounded-[40px] border border-blue-900/50 shadow-2xl relative z-10 p-5 sm:p-8 md:p-10 flex flex-col gap-10"
        >
          <ArticlesSection
            title="Непройденные статьи"
            fetchArticles={Api.ArticlesGet}
            showTestButton={true}
          />

          <ArticlesSection
            title="Пройденные статьи"
            fetchArticles={Api.ArticlesCompletedGet}
            showTestButton={false}
          />
        </motion.div>
      </div>

      <TestModal />
      <Footer />
    </>
  );
}