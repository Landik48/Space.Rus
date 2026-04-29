import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Background } from "../components/Background";
import { Api } from "../features/Api";
import { useAuthStore } from "../features/AuthStore";

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
            when: "beforeChildren",
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
        opacity: 1, 
        x: 0, 
        transition: { duration: 0.3 } 
    },
};

export function Login() {
    document.title = "Space-rus: Авторизация"
    const authStore: any = useAuthStore();
    const navigate = useNavigate();
    const [mode, setMode] = useState<'auth' | 'register'>('auth');
    const [error, setError] = useState<string | null>(null);
    const [form, updateForm] = useState({
        email: "",
        password: "",
        firstname: "",
        lastname: ""
    });
    const [isLoading, setLoading] = useState(false);

    const updForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    async function sendData(e?: React.FormEvent) {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let result;
            if (mode === 'auth') {
                result = await Api.login(form);
            } else {
                result = await Api.register(form);
            }
            authStore.setUser(result.user);
            navigate('/'); 
        } 
        catch (err: any) {
            setError(err.message || "Произошла ошибка соединения");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Background />
            <div className="min-h-screen relative overflow-x-hidden flex items-center justify-center py-6 px-4 sm:px-6 text-white font-gothic selection:bg-[#5c9cff] selection:text-white">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-4xl bg-[#0b1a40] rounded-[30px] md:rounded-[40px] border border-blue-900/50 shadow-2xl relative z-10 p-6 sm:p-10 md:p-14 flex flex-col md:flex-row gap-8 md:gap-12 min-h-[450px]"
                >
                    <div className="flex-1 flex flex-col justify-center relative z-20">
                        <motion.h1 variants={itemVariants} className="text-2xl sm:text-3xl font-medium mb-8 sm:mb-10 text-center sm:text-left">
                            {mode === 'auth' ? 'Войти' : 'Регистрация'}
                        </motion.h1>

                        <form className="flex flex-col gap-4 sm:gap-5 w-full max-w-sm mx-auto sm:mx-0" onSubmit={sendData}>
                            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                <label className="sm:w-24 text-sm sm:text-lg pl-2 sm:pl-0">E-mail:</label>
                                <input required className="flex-1 bg-[#5c9cff] p-1 rounded-full h-10 px-4 text-white placeholder-blue-800/40 outline-none border-none shadow-inner focus:ring-2 focus:ring-blue-300 transition-all" type="email" name="email" value={form.email} onChange={updForm} />
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                <label className="sm:w-24 text-sm sm:text-lg pl-2 sm:pl-0">Пароль:</label>
                                <input required className="flex-1 bg-[#5c9cff] p-1 rounded-full h-10 px-4 text-white placeholder-blue-800/40 outline-none border-none shadow-inner focus:ring-2 focus:ring-blue-300 transition-all" type="password" name="password" value={form.password} onChange={updForm} />
                            </motion.div>

                            <AnimatePresence mode="wait">
                                {mode === 'register' && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="flex flex-col gap-4 sm:gap-5 overflow-hidden"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                                            <label className="sm:w-24 text-sm sm:text-lg pl-2 sm:pl-0">Имя:</label>
                                            <input required={mode === 'register'} className="flex-1 bg-[#5c9cff] p-1 rounded-full h-10 px-4 text-white placeholder-blue-800/40 outline-none border-none shadow-inner focus:ring-2 focus:ring-blue-300 transition-all" type="text" name="firstname" value={form.firstname} onChange={updForm} />
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                            <label className="sm:w-24 text-sm sm:text-lg pl-2 sm:pl-0">Фамилия:</label>
                                            <input required={mode === 'register'} className="flex-1 bg-[#5c9cff] p-1 rounded-full h-10 px-4 text-white placeholder-blue-800/40 outline-none border-none shadow-inner focus:ring-2 focus:ring-blue-300 transition-all" type="text" name="lastname" value={form.lastname} onChange={updForm} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs sm:text-sm sm:pl-28 text-center sm:text-left animate-pulse">{error}</motion.p>}

                            <motion.div variants={itemVariants} className="sm:pl-28 mt-2 flex justify-center sm:justify-start">
                                <motion.button 
                                    type="submit" 
                                    disabled={isLoading} 
                                    whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(92, 156, 255, 0.5)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto bg-[#5c9cff] hover:bg-blue-400 text-white px-8 py-2.5 rounded-full font-medium shadow-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2 min-w-[160px]"
                                >
                                    {isLoading ? (
                                        <>
                                            Загрузка
                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        </>
                                    ) : (
                                        mode === 'auth' ? 'Авторизоваться' : 'Создать аккаунт'
                                    )}
                                </motion.button>
                            </motion.div>

                            <motion.p variants={itemVariants} className="mt-6 text-xs sm:text-sm text-[#4b6a9c] hover:text-[#5c9cff] transition-colors cursor-pointer text-center sm:text-left" onClick={() => { setMode(mode === 'auth' ? 'register' : 'auth'); setError(null); }}>
                                {mode === 'auth' ? 'Впервые здесь? Зарегистрируйтесь!' : 'Уже есть аккаунт? Войти'}
                            </motion.p>
                        </form>
                    </div>

                    <div className="hidden md:flex flex-1 relative flex-col items-end pt-16 pr-4">
                        <motion.div variants={itemVariants} className="text-right z-10 relative">
                            <p className="text-[#4b6a9c] text-xl italic mb-3 leading-tight font-light transition-all duration-500 hover:text-[#5c9cff]">
                                «Космос — это не прогулка,<br/>ракета — не самолет»
                            </p>
                            <p className="text-[#4b6a9c] text-sm">Юрий Алексеевич Гагарин</p>
                        </motion.div>

                        <motion.div 
                            variants={itemVariants}
                            className="absolute bottom-6 right-0"
                            whileHover={{ y: -10, transition: { duration: 0.2 } }}
                        >
                            <img src="/icon.png" alt="Логотип" className="w-32 h-auto object-contain" />
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 1 }} className="md:hidden flex justify-center mt-10">
                        <img src="/icon.png" alt="Логотип" className="w-24 h-auto object-contain" />
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="absolute bottom-4 sm:bottom-6 left-0 w-full text-center text-[#2a4066] text-[10px] sm:text-xs font-medium"
                    >
                        «Космос.Rus», 2026
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
}