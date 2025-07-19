"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.pageYOffset > 300);
        };
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -300, opacity: 0 }} // starts from above
                    animate={{
                        y: [-300, 40, 0, -10, 0], // fall and bounce
                        opacity: [0, 0.7, 1, 1, 1],
                    }}
                    exit={{ y: 300, opacity: 0 }} // falls out when gone
                    transition={{
                        duration: 0.9,
                        times: [0, 0.4, 0.6, 0.8, 1],
                        ease: "easeOut",
                    }}
                    whileHover={{ scale: 0.9 }}
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="fixed right-3 bottom-5 z-10 p-1 hover:scale-95 rounded-md ring-2 cursor-pointer bg-accent dark:ring-white ring-black"
                >
                    <FaArrowUp className="animate-bounce text-[20px] fill-black dark:fill-white" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
