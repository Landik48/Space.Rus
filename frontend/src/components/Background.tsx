import { memo } from "react";
import { motion } from "framer-motion";

const STAR_COUNT = 150;
const starsData = Array.from({ length: STAR_COUNT }).map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    opacity: Math.random() * 0.6 + 0.2,
    duration: Math.random() * 3 + 4,
    delay: Math.random() * -20, 
    moveX: (Math.random() - 0.5) * 40,
    moveY: (Math.random() - 0.5) * 40,
}));

export const Background = memo(() => {
    return (
        <div 
            className="fixed inset-0 bg-[#081330] overflow-hidden pointer-events-none z-[-100]"
            style={{ backfaceVisibility: "hidden" }} 
        >
            {starsData.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                    style={{
                        width: star.size,
                        height: star.size,
                        top: star.top,
                        left: star.left,
                        willChange: "transform, opacity", 
                    }}
                    animate={{ 
                        opacity: [star.opacity, 0.1, star.opacity],
                        scale: [1, 1.2, 1],
                        x: [0, star.moveX, 0],
                        y: [0, star.moveY, 0]
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: star.delay,
                    }}
                />
            ))}
            
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
        </div>
    );
});

Background.displayName = "Background";