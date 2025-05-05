import { motion } from 'framer-motion';

type SpinnerSize = 'small' | 'medium' | 'large';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  fullScreen?: boolean;
  text?: string;
}

const LoadingSpinner = ({ size = 'medium', fullScreen = false, text }: LoadingSpinnerProps) => {
  const sizeMap: Record<SpinnerSize, string> = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-16 w-16',
  };

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const dotVariants = {
    initial: { scale: 0.5, opacity: 0.3 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.7,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'h-screen' : 'h-full'}`}>
      <motion.div
        className="flex space-x-2"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div
          variants={dotVariants}
          className={`${sizeMap[size]} rounded-full bg-primary/70`}
        />
        <motion.div
          variants={dotVariants}
          className={`${sizeMap[size]} rounded-full bg-primary/80`}
        />
        <motion.div
          variants={dotVariants}
          className={`${sizeMap[size]} rounded-full bg-primary`}
        />
      </motion.div>

      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-sm font-medium text-foreground/80"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
