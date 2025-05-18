
import { useState } from 'react';
import { useQuiz } from '@/context/QuizContext';

export const useEmailValidation = () => {
  const { quizData, updateQuizData } = useQuiz();
  const [emailValid, setEmailValid] = useState(false);
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    updateQuizData('email', email);
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  };
  
  return {
    email: quizData.email || '',
    emailValid,
    handleEmailChange
  };
};
