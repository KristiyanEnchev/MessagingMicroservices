import { motion } from 'framer-motion';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="border-t border-border py-4 px-6 mt-auto bg-card/80 backdrop-blur-sm"
    >
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          © {currentYear} Admin Panel. All rights reserved.
        </p>
        
        <div className="flex space-x-4">
          <a 
            href="#" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </motion.footer>
  );
};
