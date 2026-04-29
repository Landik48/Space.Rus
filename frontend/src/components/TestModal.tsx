import { motion, AnimatePresence } from 'framer-motion';
import { useTestStore } from '../features/TestsStore';
import { Test } from '../pages/Test';
import { useEffect } from 'react';

export function TestModal() {
  const { isOpen, testId, onComplete, closeTest } = useTestStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeTest();
    };
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, closeTest]);

  const handleComplete = (answers: any[]) => {
    onComplete?.(answers);
    setTimeout(() => {closeTest(); window.location.reload()}, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && testId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={closeTest}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4 rounded-[40px]"
          >
            <Test 
              testId={testId} 
              onComplete={handleComplete}
              onClose={closeTest}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}