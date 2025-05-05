import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useVerify2FACodeMutation } from '@/services/auth/twoFactorAuthApi';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const TwoFactorAuth = () => {
  const [code, setCode] = useState('');
  const [inputRefs, setInputRefs] = useState<(HTMLInputElement | null)[]>([]);
  const [seconds, setSeconds] = useState(300);
  const navigate = useNavigate();
  const location = useLocation();
  
  const userId = new URLSearchParams(location.search).get('userId') || '';
  const transactionId = new URLSearchParams(location.search).get('transactionId') || '';
  
  const [verify2FACode, { isLoading }] = useVerify2FACodeMutation();
  
  useEffect(() => {
    if (!userId || !transactionId) {
      toast.error('Missing required authentication parameters');
      navigate('/login');
    }
    
    setInputRefs(Array(6).fill(null));
    
    const timer = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [userId, transactionId, navigate]);
  
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode.join(''));
    
    if (value && index < 5) {
      inputRefs[index + 1]?.focus();
    }
  };
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1]?.focus();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedCode = pastedData.replace(/\D/g, '').substring(0, 6);
    
    if (pastedCode.length === 6) {
      setCode(pastedCode);
      
      for (let i = 0; i < 6; i++) {
        if (inputRefs[i]) {
          inputRefs[i]!.value = pastedCode[i];
        }
      }
      
      inputRefs[5]?.focus();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    
    try {
      const result = await verify2FACode({
        userId,
        code,
        transactionId
      }).unwrap();
      
      if (result.success) {
        toast.success('Authentication successful');
        navigate('/admin/dashboard');
      } else {
        toast.error(result.errors?.[0] || 'Verification failed');
      }
    } catch (error) {
      toast.error('Failed to verify code. Please try again.');
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-background">
      <motion.div 
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={childVariants} className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
        </motion.div>
        
        <motion.h2 
          variants={childVariants}
          className="mt-6 text-center text-3xl font-extrabold text-foreground"
        >
          Two-Factor Authentication
        </motion.h2>
        
        <motion.p 
          variants={childVariants}
          className="mt-2 text-center text-sm text-muted-foreground"
        >
          Enter the verification code sent to your device
        </motion.p>
        
        <motion.div variants={childVariants} className="mt-8">
          <div className="rounded-md shadow-sm -space-y-px">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-2 justify-center">
                {Array(6).fill(0).map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    ref={el => inputRefs[index] = el}
                    value={code[index] || ''}
                    onChange={e => handleInputChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="focus:ring-primary focus:border-primary w-12 h-12 text-center text-xl border-border rounded-md bg-background text-foreground"
                  />
                ))}
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={code.length !== 6 || isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <KeyRound className="mr-2 h-4 w-4" />
                      Verify Code
                    </div>
                  )}
                </button>
              </div>
            </form>
            
            {seconds > 0 ? (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Code expires in: <span className="text-foreground font-medium">{formatTime(seconds)}</span>
              </div>
            ) : (
              <div className="mt-4 text-center">
                <div className="bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                  <span className="text-sm text-amber-700 dark:text-amber-400">
                    Your code has expired. Please request a new one.
                  </span>
                </div>
                <button 
                  className="mt-4 inline-flex items-center px-3 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  onClick={() => navigate('/login')}
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TwoFactorAuth;