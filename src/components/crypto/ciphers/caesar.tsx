"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Copy, Download, Lock, Unlock } from "lucide-react";

export function CaesarCipher() {
  const [input, setInput] = useState("Hello World!");
  const [shift, setShift] = useState(3);
  const [isEncrypting, setIsEncrypting] = useState(true);

  const processText = (text: string, shift: number): string => {
    return text
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          // Uppercase letters
          return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
        }
        if (code >= 97 && code <= 122) {
          // Lowercase letters
          return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97);
        }
        return char;
      })
      .join("");
  };

  const output = useMemo(() => {
    const effectiveShift = isEncrypting ? shift : -shift;
    return processText(input, effectiveShift);
  }, [input, shift, isEncrypting]);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEncrypting ? "Plaintext" : "Ciphertext"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your message here..."
              className="min-h-[200px] font-mono"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{isEncrypting ? "Ciphertext" : "Plaintext"}</CardTitle>
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(output)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
             <Textarea
              value={output}
              readOnly
              placeholder="Result..."
              className="min-h-[200px] font-mono bg-muted/50"
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-full sm:w-auto flex-shrink-0">
                <Label htmlFor="shift-value" className="mb-2 block">Shift Value: {shift}</Label>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-mono">A</span>
                    <Slider
                        id="shift-value"
                        min={1}
                        max={25}
                        step={1}
                        value={[shift]}
                        onValueChange={(value) => setShift(value[0])}
                        className="w-48"
                    />
                    <span className="text-sm font-mono">Z</span>
                </div>
            </div>
            <div className="flex-grow flex justify-center items-center gap-4">
                <Button variant={isEncrypting ? 'default' : 'secondary'} onClick={() => setIsEncrypting(true)} className="relative">
                    <Lock className={`h-5 w-5 transition-all duration-300 ${isEncrypting ? 'scale-100' : 'scale-0'}`} />
                    <span className={`transition-opacity duration-300 ${isEncrypting ? 'opacity-100' : 'opacity-0'}`}>&nbsp;Encrypt</span>
                </Button>
                <div className="flex flex-col items-center">
                    <ArrowRight className="h-4 w-4" />
                    <span className="text-xs text-muted-foreground">A {'->'} {String.fromCharCode(65 + (shift % 26))}</span>
                </div>
                <Button variant={!isEncrypting ? 'default' : 'secondary'} onClick={() => setIsEncrypting(false)} className="relative">
                    <Unlock className={`h-5 w-5 transition-all duration-300 ${!isEncrypting ? 'scale-100' : 'scale-0'}`} />
                     <span className={`transition-opacity duration-300 ${!isEncrypting ? 'opacity-100' : 'opacity-0'}`}>&nbsp;Decrypt</span>
                </Button>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
