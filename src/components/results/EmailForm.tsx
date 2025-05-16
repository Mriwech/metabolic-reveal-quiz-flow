
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

type EmailFormProps = {
  email: string;
  emailValid: boolean;
  submitting: boolean;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
};

const EmailForm: React.FC<EmailFormProps> = ({ 
  email, 
  emailValid, 
  submitting, 
  handleEmailChange, 
  handleSubmit 
}) => {
  return (
    <div className="bg-gradient-to-r from-brand-teal to-brand-blue text-white p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-3">
        <span className="mr-2">📧</span>
        Enter your email to unlock your FULL report:
      </h3>
      <p className="mb-4">Complete with 3-step solution blueprint tailored to your metabolism</p>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-white">Email Address</Label>
          <Input
            id="email"
            type="email"
            className="bg-white text-black mt-1"
            placeholder="Your email address"
            value={email || ''}
            onChange={handleEmailChange}
          />
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={!emailValid || submitting}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-base sm:text-lg py-6 px-4 max-w-full whitespace-normal h-auto flex items-center justify-center space-x-2"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : "SEND MY REPORT & WATCH VIDEO"}
        </Button>
        
        <div className="text-xs text-center opacity-75">
          Your privacy is protected. We will never spam you or sell your data.
        </div>
      </div>
    </div>
  );
};

export default EmailForm;
