"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Lock, Unlock, Upload, Download, Shield, Key, FileText, CheckCircle, AlertCircle, Eye, EyeOff, RefreshCw, Copy, Check } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { encrypt, decrypt, generatePassword as generateSecurePassword } from '@/lib/crypto';
import { useToast } from "@/hooks/use-toast";


const PasswordStrengthIndicator = ({ score, text, color }: { score: number, text: string, color: string }) => {
  if (!text) return null;

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">Password Strength:</span>
        <span className={`text-sm font-medium ${
          score <= 2 ? 'text-red-600' : 
          score === 3 ? 'text-blue-600' : 'text-green-600'
        }`}>
          {text}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Use 12+ characters with uppercase, lowercase, numbers, and symbols
      </p>
    </div>
  );
};


export function PdfLocker() {
  const [activeTab, setActiveTab] = useState('lock');
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ type: string; url: string; filename: string; size: string; password?: string } | null>(null);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: '', color: '' };
    
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z\d]/.test(pwd)) score++;

    const strengths = [
      { score: 0, text: 'Very Weak', color: 'bg-red-600' },
      { score: 1, text: 'Weak', color: 'bg-orange-600' },
      { score: 2, text: 'Fair', color: 'bg-yellow-600' },
      { score: 3, text: 'Good', color: 'bg-blue-600' },
      { score: 4, text: 'Strong', color: 'bg-green-600' },
      { score: 5, text: 'Very Strong', color: 'bg-green-700' }
    ];

    return strengths[score];
  };

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword();
    setPassword(newPassword);
    setConfirmPassword(newPassword);
    setGeneratedPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
    setShowPassword(true);
  };
  
  const copyPassword = async () => {
    if (!generatedPassword) return;
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      toast({ title: 'Password copied to clipboard!' });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({ title: 'Failed to copy password.', variant: 'destructive' });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
    setGeneratedPassword('');
  };

  const processEncrypt = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }
    if (!password) {
      setError('Please enter a password');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResult(null);

    try {
      const fileBuffer = await file.arrayBuffer();
      const encryptedBuffer = await encrypt(fileBuffer, password);

      const blob = new Blob([encryptedBuffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      
      setResult({
        type: 'encrypted',
        url: url,
        filename: file.name.replace(/\.pdf$/i, '_encrypted.bin'),
        size: (encryptedBuffer.byteLength / 1024).toFixed(2),
        password: generatedPassword || password
      });

      if (!generatedPassword) {
        setPassword('');
        setConfirmPassword('');
        setPasswordStrength({ score: 0, text: '', color: '' });
      }

    } catch (err: any) {
      setError('Encryption failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const processDecrypt = async () => {
    if (!file) {
      setError('Please select an encrypted file');
      return;
    }
    if (!password) {
      setError('Please enter the password');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResult(null);

    try {
      const fileBuffer = await file.arrayBuffer();
      const decryptedBuffer = await decrypt(fileBuffer, password);

      const blob = new Blob([decryptedBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setResult({
        type: 'decrypted',
        url: url,
        filename: file.name.replace(/_encrypted\.bin$/i, '_decrypted.pdf'),
        size: (decryptedBuffer.byteLength / 1024).toFixed(2)
      });
      setPassword('');

    } catch (err: any) {
      setError('Decryption failed: Invalid password or corrupted file');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      const validLock = activeTab === 'lock' && selectedFile.type === 'application/pdf';
      const validUnlock = activeTab === 'unlock' && selectedFile.name.endsWith('.bin');
      
      if (validLock || validUnlock) {
        setFile(selectedFile);
        setError('');
        setResult(null);
      } else {
        setError(activeTab === 'lock' ? 'Please select a PDF file' : 'Please select an encrypted .bin file');
      }
    }
  }, [activeTab]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true, noKeyboard: true });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setFile(null);
    setPassword('');
    setConfirmPassword('');
    setGeneratedPassword('');
    setError('');
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Shield className="w-12 h-12 text-gray-800" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Secure PDF Locker
        </h1>
        <p className="text-gray-600">
          AES-256-GCM encryption for your PDFs
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleTabChange('lock')}
            className={`flex-1 py-4 px-6 font-medium transition-colors rounded-tl-lg ${
              activeTab === 'lock'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Lock className="w-5 h-5 inline mr-2" />
            Lock PDF
          </button>
          <button
            onClick={() => handleTabChange('unlock')}
            className={`flex-1 py-4 px-6 font-medium transition-colors rounded-tr-lg ${
              activeTab === 'unlock'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Unlock className="w-5 h-5 inline mr-2" />
            Unlock PDF
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div className="mb-6">
            <label className="block text-gray-900 font-medium mb-3">
              <FileText className="w-4 h-4 inline mr-2" />
              Select {activeTab === 'lock' ? 'PDF' : 'Encrypted'} File
            </label>
            <div
              {...getRootProps()}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-gray-900 hover:bg-gray-50 transition-colors ${isDragActive ? 'border-gray-900 bg-gray-50' : 'border-gray-300'}`}
            >
              <input
                ref={fileInputRef}
                {...getInputProps()}
                type="file"
                accept={activeTab === 'lock' ? '.pdf' : '.bin'}
                className="hidden"
              />
              <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              {file ? (
                <div>
                  <p className="text-gray-900 font-medium">{file.name}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-900 mb-1">{isDragActive ? 'Drop the file here...' : 'Click or drag file to upload'}</p>
                  <p className="text-gray-500 text-sm">
                    {activeTab === 'lock' ? 'PDF files only' : 'Encrypted .bin files only'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {activeTab === 'lock' && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-1">Auto-Generate Password</h3>
              <p className="text-sm text-gray-600 mb-3">
                Creates a 32-character cryptographically secure password optimized for AES-256
              </p>
              <button
                onClick={handleGeneratePassword}
                className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Generate Secure Password
              </button>
              
              {generatedPassword && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Your Generated Password:</span>
                    <button
                      onClick={copyPassword}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                      title="Copy password"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="font-mono text-sm bg-gray-100 p-3 rounded break-all text-gray-900">
                    {generatedPassword}
                  </div>
                  <p className="text-xs text-red-600 mt-2 font-medium">
                    ⚠️ Save this password securely! You'll need it to decrypt your file.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-900 font-medium mb-3">
              <Key className="w-4 h-4 inline mr-2" />
              {activeTab === 'lock' ? 'Create Password (or use generated)' : 'Enter Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all pr-12"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {activeTab === 'lock' && password && !generatedPassword && (
              <PasswordStrengthIndicator {...passwordStrength} />
            )}
          </div>

          {activeTab === 'lock' && (
            <div className="mb-6">
              <label className="block text-gray-900 font-medium mb-3">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
              />
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {result && (
            <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-green-900 font-semibold text-lg mb-1">
                    {result.type === 'encrypted' ? 'PDF Successfully Encrypted!' : 'PDF Successfully Decrypted!'}
                  </p>
                  <p className="text-green-700 text-sm mb-3">
                    File size: {result.size} KB
                  </p>
                  {result.password && (
                    <div className="bg-white p-3 rounded border border-green-300 mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Your Password:</p>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all text-gray-900">
                        {result.password}
                      </p>
                      <p className="text-xs text-red-600 mt-2 font-medium">
                        ⚠️ Save this password! You won't be able to recover your file without it.
                      </p>
                    </div>
                  )}
                  <a
                    href={result.url}
                    download={result.filename}
                    className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download {result.type === 'encrypted' ? 'Encrypted' : 'Decrypted'} File
                  </a>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={activeTab === 'lock' ? processEncrypt : processDecrypt}
            disabled={isProcessing}
            className="w-full py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                {activeTab === 'lock' ? (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Encrypt PDF
                  </>
                ) : (
                  <>
                    <Unlock className="w-5 h-5 mr-2" />
                    Decrypt PDF
                  </>
                )}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-gray-900 font-semibold text-lg mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Security Features
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-gray-600 text-sm">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-gray-900 rounded-full mr-3 mt-1.5 flex-shrink-0" />
            <p><strong className="text-gray-900">AES-256-GCM:</strong> Military-grade encryption</p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-gray-900 rounded-full mr-3 mt-1.5 flex-shrink-0" />
            <p><strong className="text-gray-900">PBKDF2:</strong> 100,000 iterations</p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-gray-900 rounded-full mr-3 mt-1.5 flex-shrink-0" />
            <p><strong className="text-gray-900">Client-side:</strong> All processing in browser</p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-gray-900 rounded-full mr-3 mt-1.5 flex-shrink-0" />
            <p><strong className="text-gray-900">Zero Knowledge:</strong> No server uploads</p>
          </div>
        </div>
      </div>
    </div>
  );
}
