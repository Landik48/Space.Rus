import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Api } from '../features/Api';

type Variant = {
  id: number;
  variant: string;
};

type Question = {
  id: number;
  title: string;
  description: string;
  variants: Variant[];
};

type Answer = {
  questionId: number;
  variantId: number;
};

type TestProps = {
  testId: number;
  onComplete?: (answers: Answer[]) => void;
  onClose?: () => void;
};

export function Test({ testId, onComplete, onClose }: TestProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testName, setTestName] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTest = async () => {
      try {
        setLoading(true);
        const response = await Api.TestGet(testId);
        setQuestions(response.body || []);
        setTestName(response.name || '');
      } catch (error) {
        console.error('Ошибка загрузки теста:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTest();
  }, [testId]);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleSelect = (variantId: number) => {
    setSelectedVariant(variantId);
  };

  const handleNext = () => {
    if (selectedVariant === null) return;

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      variantId: selectedVariant,
    };

    const existingAnswerIndex = answers.findIndex(
      a => a.questionId === currentQuestion.id
    );

    let finalAnswers: Answer[];
    if (existingAnswerIndex !== -1) {
      const newAnswers = [...answers];
      newAnswers[existingAnswerIndex] = newAnswer;
      finalAnswers = newAnswers;
      setAnswers(newAnswers);
    } else {
      finalAnswers = [...answers, newAnswer];
      setAnswers(finalAnswers);
    }

    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
      setSelectedVariant(null);
    } else {
      setIsCompleted(true);
      onComplete?.(finalAnswers);
      Api.TestComplete(testId, finalAnswers).catch(console.error);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
      const prevAnswer = answers.find(a => a.questionId === questions[currentIndex - 1].id);
      setSelectedVariant(prevAnswer?.variantId || null);
    }
  };

  const getVariantStyle = (variantId: number) => {
    const isSelected = selectedVariant === variantId;
    return `
      p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer
      ${isSelected 
        ? 'border-[#5c9cff] bg-[#5c9cff]/20 shadow-[0_0_20px_rgba(92,156,255,0.4)] scale-[1.005]' 
        : 'border-white/10 bg-white/5 hover:border-[#5c9cff]/50 hover:bg-[#5c9cff]/10 hover:shadow-[0_0_15px_rgba(92,156,255,0.2)] hover:scale-[1.005]'
      }
    `;
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-gradient-to-br from-[#0a1a3a] to-[#0f2847] backdrop-blur-xl rounded-[40px] border border-blue-400/20 shadow-[0_0_80px_rgba(92,156,255,0.3)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-14 h-14 border-4 border-[#5c9cff] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-6 p-8 bg-gradient-to-br from-[#0a1a3a] to-[#0f2847] backdrop-blur-xl rounded-[40px] border border-blue-400/20 shadow-[0_0_80px_rgba(92,156,255,0.25)] relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all border border-white/10 hover:border-white/30"
        >
          <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-28 h-28 bg-gradient-to-br from-[#5c9cff] to-[#3a7bd5] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(92,156,255,0.6)]"
        >
          <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Тест завершён!</h2>
        <p className="text-white/70 text-lg">Спасибо за прохождение теста</p>
        {testName && <p className="text-white/40 text-sm font-medium">Тест: {testName}</p>}
        <div className="mt-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 w-full max-w-md">
          <h3 className="text-white font-semibold mb-4">Твои ответы:</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {answers.map((answer, index) => {
              const question = questions.find(q => q.id === answer.questionId);
              const variant = question?.variants.find(v => v.id === answer.variantId);
              return (
                <div key={index} className="text-white/80 text-sm">
                  <span className="font-semibold text-[#5c9cff]">{question?.title}</span>: {variant?.variant}
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-white/30 text-sm mt-2">Окно закроется автоматически через 3 секунды...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#0a1a3a]/95 to-[#0f2847]/95 backdrop-blur-xl rounded-[40px] border border-blue-400/20 p-6 sm:p-8 relative shadow-[0_0_60px_rgba(92,156,255,0.2)]">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all border border-white/10 hover:border-white/30 z-10"
      >
        <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {testName && (
        <div className="mb-2 text-sm text-white/40 font-medium tracking-wide">Тест: {testName}</div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/50 text-sm font-medium">
            Вопрос {currentIndex + 1} из {questions.length}
          </span>
          <span className="text-[#5c9cff] text-sm font-bold">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#5c9cff] to-[#3a7bd5] rounded-full shadow-[0_0_10px_#5c9cff]"
          />
        </div>
      </div>

      <div className="relative px-1 overflow-visible">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight"
            >
              {currentQuestion.title}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-white/50 mb-8 text-base sm:text-lg leading-relaxed"
            >
              {currentQuestion.description}
            </motion.p>

            <div className="space-y-4">
              {currentQuestion.variants.map((variant, index) => (
                <motion.div
                  key={variant.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                  className={getVariantStyle(variant.id)}
                  onClick={() => handleSelect(variant.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                      ${selectedVariant === variant.id 
                        ? 'border-[#5c9cff] bg-[#5c9cff] shadow-[0_0_10px_#5c9cff]' 
                        : 'border-white/30'
                      }
                    `}>
                      {selectedVariant === variant.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </div>
                    <span className="text-white text-base sm:text-lg font-medium">{variant.variant}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between mt-8">
        <motion.button
          whileHover={currentIndex !== 0 ? { scale: 1.02 } : {}}
          whileTap={currentIndex !== 0 ? { scale: 0.98 } : {}}
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`
            px-6 py-3 rounded-full font-medium transition-all border
            ${currentIndex === 0 
              ? 'opacity-30 cursor-not-allowed bg-white/5 text-white/40 border-white/5' 
              : 'bg-white/5 text-white/80 hover:bg-white/10 border-white/10 hover:border-white/20 backdrop-blur-sm'
            }
          `}
        >
          Назад
        </motion.button>

        <motion.button
          whileHover={selectedVariant ? { scale: 1.02 } : {}}
          whileTap={selectedVariant ? { scale: 0.98 } : {}}
          onClick={handleNext}
          disabled={!selectedVariant}
          className={`
            px-8 py-3 rounded-full font-medium transition-all
            ${!selectedVariant 
              ? 'opacity-30 cursor-not-allowed bg-white/5 text-white/40' 
              : 'bg-gradient-to-r from-[#5c9cff] to-[#3a7bd5] text-white shadow-lg shadow-[#5c9cff]/30 hover:shadow-[#5c9cff]/50 border border-white/20'
            }
          `}
        >
          {currentIndex === questions.length - 1 ? 'Завершить' : 'Далее'}
        </motion.button>
      </div>
    </div>
  );
}