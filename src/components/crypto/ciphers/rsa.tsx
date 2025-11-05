"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Copy, Download, Wand2, PenSquare, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function RSACipher() {
  const [message, setMessage] = useState("");
  const [encrypted, setEncrypted] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const handleGenerateKeys = () => {
    // Placeholder for RSA key pair generation
    setPublicKey("---BEGIN PUBLIC KEY---\n(Generated Public Key)\n---END PUBLIC KEY---");
    setPrivateKey("---BEGIN PRIVATE KEY---\n(Generated Private Key)\n---END PRIVATE KEY---");
  };
  
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Key Pair Generation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
             <Button onClick={handleGenerateKeys} size="lg"><Wand2 className="mr-2 h-4 w-4" /> Generate New Key Pair</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Public Key</h3>
                 <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(publicKey)}><Copy className="h-4 w-4" /></Button>
              </div>
              <Textarea value={publicKey} readOnly placeholder="Generate or paste a public key..." className="h-48 font-mono text-xs"/>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Private Key</h3>
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(privateKey)}><Copy className="h-4 w-4" /></Button>
              </div>
              <Textarea value={privateKey} readOnly placeholder="Generate or paste a private key..." className="h-48 font-mono text-xs"/>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Encryption & Decryption</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter plaintext to encrypt..." className="h-24 font-mono" />
            </div>
            <div className="flex justify-center gap-4">
              <Button>Encrypt with Public Key</Button>
              <Button variant="secondary">Decrypt with Private Key</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="encrypted-output">Encrypted Output</Label>
                    <Textarea id="encrypted-output" value={encrypted} readOnly placeholder="Encrypted result..." className="h-24 font-mono bg-muted/50" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="decrypted-output">Decrypted Output</Label>
                    <Textarea id="decrypted-output" value={decrypted} readOnly placeholder="Decrypted result..." className="h-24 font-mono bg-muted/50" />
                </div>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
