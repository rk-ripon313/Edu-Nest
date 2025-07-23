"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative bg-light_bg dark:bg-dark_bg text-zinc-900 dark:text-white py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-grotesk"
        >
          Empower Your Learning Journey with{" "}
          <span className="text-primary">Edu-Nest</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 text-lg md:text-xl max-w-2xl mx-auto font-sora text-muted-foreground"
        >
          Discover curated study series, digital books, and resources from top
          educators across Bangladesh.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link href="/study-series">
            <Button
              className="text-white font-sora px-6 py-3 text-base"
              size="lg"
            >
              Browse Study Series
            </Button>
          </Link>

          <Link href="/books">
            <Button
              variant="outline"
              className="font-sora px-6 py-3 text-base"
              size="lg"
            >
              Explore Books
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
