"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mail, Clock, RefreshCw, CheckCircle2, AlertCircle, X, ShieldCheck } from "lucide-react";

interface OtpVerificationModalProps {
  isOpen: boolean;
  email: string;
  userName: string;
  expiresAt: number; // Timestamp in ms
  demoNotice?: string | null;
  onVerify: (otp: string) => Promise<boolean>;
  onResend: () => Promise<{ success: boolean; newExpiresAt?: number; demoNotice?: string | null }>;
  onClose: () => void;
}

export default function OtpVerificationModal({
  isOpen,
  email,
  userName,
  expiresAt,
  demoNotice,
  onVerify,
  onResend,
  onClose,
}: OtpVerificationModalProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [currentDemoNotice, setCurrentDemoNotice] = useState<string | null>(demoNotice || null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update demo notice if prop changes
  useEffect(() => {
    if (demoNotice) {
      setCurrentDemoNotice(demoNotice);
    }
  }, [demoNotice]);

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen) return;

    const updateTimer = () => {
      const remainingSeconds = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setTimeLeft(remainingSeconds);
      if (remainingSeconds === 0) {
        setErrorMsg("Code expired. Please request a new verification code.");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isOpen, expiresAt]);

  // Auto-focus first empty box on open
  useEffect(() => {
    if (isOpen) {
      setDigits(["", "", "", "", "", ""]);
      setErrorMsg(null);
      setSuccessMsg(null);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDigitChange = (index: number, value: string) => {
    setErrorMsg(null);
    // Allow only numeric input
    const cleanValue = value.replace(/\D/g, "");

    if (!cleanValue) {
      const newDigits = [...digits];
      newDigits[index] = "";
      setDigits(newDigits);
      return;
    }

    // If single digit typed
    const singleChar = cleanValue.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = singleChar;
    setDigits(newDigits);

    // Auto-advance focus to next input box
    if (index < 5 && singleChar) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Move back to previous box on backspace if current is empty
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...digits];
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i];
    }
    setDigits(newDigits);

    // Focus last pasted or next unfilled box
    const nextFocusIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = digits.join("");

    if (enteredOtp.length < 6) {
      setErrorMsg("Please enter all 6 digits of your verification code.");
      return;
    }

    if (timeLeft <= 0) {
      setErrorMsg("Code expired. Please click 'Resend OTP' to get a new code.");
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const isValid = await onVerify(enteredOtp);
      if (isValid) {
        setSuccessMsg("Email verified successfully! Creating your ApnaKona account...");
      } else {
        setErrorMsg("Incorrect code, please try again.");
      }
    } catch {
      setErrorMsg("Failed to verify code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendClick = async () => {
    if (isResending) return;
    setIsResending(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const result = await onResend();
      if (result.success) {
        setDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        if (result.demoNotice) {
          setCurrentDemoNotice(result.demoNotice);
        }
      } else {
        setErrorMsg("Failed to resend code. Please try again in a moment.");
      }
    } catch {
      setErrorMsg("Error while requesting new code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="otp-modal-title"
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 p-6 sm:p-8 transform transition-all animate-scale-in"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close verification modal"
          className="absolute right-4 top-4 p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Heading */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#0F4C81]/10 dark:bg-sky-500/20 text-[#0F4C81] dark:text-sky-300 mx-auto flex items-center justify-center mb-3 shadow-xs">
            <Mail className="w-7 h-7" />
          </div>
          <h2 id="otp-modal-title" className="font-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Verify Your Email
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1.5 max-w-xs mx-auto">
            We sent a 6-digit verification code to{" "}
            <span className="font-semibold text-gray-800 dark:text-slate-200 break-all">{email}</span>
          </p>
        </div>

        {/* Development / Demo Mode Alert */}
        {currentDemoNotice && (
          <div className="mb-5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              <span className="font-bold">Test Mode Active:</span> {currentDemoNotice}
            </div>
          </div>
        )}

        {/* OTP Input Form */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* 6 Individual Digit Inputs */}
          <div>
            <div className="flex items-center justify-center gap-2 sm:gap-2.5">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={idx === 0 ? handlePaste : undefined}
                  disabled={isVerifying || successMsg !== null}
                  aria-label={`Digit ${idx + 1}`}
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-2xl border-2 transition-all outline-none ${
                    digit
                      ? "border-[#0F4C81] dark:border-sky-400 bg-blue-50/40 dark:bg-sky-950/20 text-[#0F4C81] dark:text-sky-300"
                      : "border-gray-200 dark:border-slate-700 bg-gray-50/60 dark:bg-slate-800/60 text-gray-900 dark:text-white focus:border-[#0F4C81] dark:focus:border-sky-400 focus:bg-white dark:focus:bg-slate-800"
                  } disabled:opacity-50`}
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 py-2 px-3 rounded-xl animate-fade-up">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 py-2 px-3 rounded-xl animate-fade-up">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Timer and Resend Row */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>
                {timeLeft > 0 ? (
                  <>Expires in <strong className="text-gray-800 dark:text-slate-200 font-mono">{formatTime(timeLeft)}</strong></>
                ) : (
                  <span className="text-red-500 font-semibold">Code expired</span>
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={handleResendClick}
              disabled={isResending || isVerifying || timeLeft > 270} // 30s cooldown from 300s
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF6B35] hover:text-[#e85a22] disabled:text-gray-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isResending ? "animate-spin" : ""}`} />
              <span>{isResending ? "Sending..." : "Resend OTP"}</span>
            </button>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isVerifying || digits.join("").length < 6 || successMsg !== null}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#FF6B35] hover:bg-[#e85a22] text-white font-bold text-sm shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer min-h-[48px]"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <span>Verify &amp; Create Account</span>
            )}
          </button>
        </form>

        {/* Security & Architecture Note */}
        <p className="text-[11px] text-gray-400 dark:text-slate-500 text-center mt-4">
          OTP verification ensures safe student community access.
        </p>
      </div>
    </div>
  );
}
