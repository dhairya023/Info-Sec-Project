"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileDropzone } from "@/components/file-dropzone";
import { PasswordInput } from "@/components/password-input";
import { useToast } from "@/hooks/use-toast";
import { encrypt, decrypt, generatePassword } from "@/lib/crypto";
import {
  Lock,
  Unlock,
  Loader2,
  Copy,
  Wand2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Accept } from "react-dropzone";

type Operation = "lock" | "unlock";

const acceptTypes: Record<Operation, Accept> = {
    lock: { "application/pdf": [".pdf"] },
    unlock: { "application/octet-stream": [".bin"] },
};

export function PdfLocker() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Operation>("lock");
  const { toast } = useToast();

  const handleFileAccepted = (acceptedFile: File) => {
    const fileExtension = acceptedFile.name.split('.').pop()?.toLowerCase();

    if (activeTab === 'lock' && acceptedFile.type !== 'application/pdf') {
        toast({
            title: "Invalid File Type",
            description: "Please upload a valid PDF file for locking.",
            variant: "destructive",
        });
        return;
    }
    
    if (activeTab === 'unlock' && fileExtension !== 'bin') {
        toast({
            title: "Invalid File Type",
            description: "Please upload a .bin file for unlocking.",
            variant: "destructive",
        });
        return;
    }

    setFile(acceptedFile);
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setPassword(newPassword);
    setConfirmPassword(newPassword);
    setGeneratedPassword(newPassword);
    navigator.clipboard.writeText(newPassword);
    toast({
      title: "Password Generated",
      description: "A secure password has been generated and copied to your clipboard.",
    });
  };

  const processFile = async (operation: Operation) => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a file to process.",
        variant: "destructive",
      });
      return;
    }
    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter a password.",
        variant: "destructive",
      });
      return;
    }
    if (operation === "lock" && password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        description: "Please ensure both password fields are identical.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setGeneratedPassword(null);

    try {
      const fileBuffer = await file.arrayBuffer();
      let outputBuffer: ArrayBuffer;
      let outputFileName: string;

      if (operation === "lock") {
        outputBuffer = await encrypt(fileBuffer, password);
        outputFileName = `${file.name.replace(/\.pdf$/i, "")}.bin`;
        if (password === confirmPassword && password.length > 0) {
            setGeneratedPassword(password);
        }
      } else {
        outputBuffer = await decrypt(fileBuffer, password);
        outputFileName = file.name.replace(/\.bin$/i, ".pdf");
        if (!outputFileName.toLowerCase().endsWith('.pdf')) {
          outputFileName += '.pdf';
        }
      }

      const blob = new Blob([outputBuffer], {
        type: operation === "lock" ? "application/octet-stream" : "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = outputFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: `File ${operation === "lock" ? "Locked" : "Unlocked"}`,
        description: `Your file has been successfully ${
          operation === "lock" ? "encrypted" : "decrypted"
        } and downloaded.`,
        action: (
          <div className="text-green-500">
            <ShieldCheck />
          </div>
        ),
      });

    } catch (error: any) {
      toast({
        title: "An Error Occurred",
        description: error.message || `Failed to ${operation} the file.`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPasswordFields = (isLocking: boolean) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={isLocking ? "lock-password" : "unlock-password"} className="text-gray-300">
          Password
        </Label>
        <PasswordInput
          id={isLocking ? "lock-password" : "unlock-password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isProcessing}
        />
      </div>
      {isLocking && (
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <PasswordInput
            id="confirm-password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isProcessing}
          />
        </div>
      )}
      {isLocking && (
         <Button variant="outline" className="w-full bg-transparent hover:bg-white/10 text-white" onClick={handleGeneratePassword} disabled={isProcessing}>
            <Wand2 className="mr-2 h-4 w-4" />
            Generate & Copy Secure Password
        </Button>
      )}
    </div>
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value as Operation);
    setFile(null);
    setPassword("");
    setConfirmPassword("");
    setGeneratedPassword(null);
  }

  return (
    <Card className="w-full bg-black/30 backdrop-blur-lg shadow-2xl border-purple-500/20">
      <Tabs defaultValue="lock" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2 bg-black/20 m-2 w-[calc(100%-1rem)]">
          <TabsTrigger value="lock">
            <Lock className="mr-2 h-4 w-4" />
            Lock PDF
          </TabsTrigger>
          <TabsTrigger value="unlock">
            <Unlock className="mr-2 h-4 w-4" />
            Unlock PDF
          </TabsTrigger>
        </TabsList>
        <TabsContent value="lock">
          <CardContent className="space-y-6 pt-6">
            <FileDropzone onFileAccepted={handleFileAccepted} file={file} accept={acceptTypes.lock} operation="lock" />
            {renderPasswordFields(true)}
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button
              className="w-full"
              onClick={() => processFile("lock")}
              disabled={isProcessing || !file}
            >
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lock className="mr-2 h-4 w-4" />
              )}
              Lock & Download
            </Button>
            {generatedPassword && (
                <div className="mt-4 p-4 bg-purple-900/50 border border-purple-700/50 rounded-lg w-full">
                    <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5"/>
                        <div>
                            <h4 className="font-bold text-yellow-200">Save Your Password!</h4>
                            <p className="text-sm text-yellow-300">
                                This password cannot be recovered. Keep it safe to unlock your file.
                            </p>
                            <div className="mt-2 flex items-center gap-2 bg-black/30 p-2 rounded-md">
                                <code className="text-sm text-gray-200 truncate flex-grow">{generatedPassword}</code>
                                <Button size="icon" variant="ghost" onClick={() => {
                                    navigator.clipboard.writeText(generatedPassword);
                                    toast({ title: "Copied to clipboard!" });
                                }}>
                                    <Copy className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </CardFooter>
        </TabsContent>
        <TabsContent value="unlock">
          <CardContent className="space-y-6 pt-6">
            <FileDropzone onFileAccepted={handleFileAccepted} file={file} accept={acceptTypes.unlock} operation="unlock" />
            {renderPasswordFields(false)}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => processFile("unlock")}
              disabled={isProcessing || !file}
            >
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Unlock className="mr-2 h-4 w-4" />
              )}
              Unlock & Download
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
