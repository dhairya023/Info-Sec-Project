"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Copy, Download, Wand2 } from "lucide-react";

export function AESCipher() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [key, setKey] = useState("");
  const [iv, setIv] = useState("");

  const handleEncrypt = () => {
    // Placeholder for AES encryption logic
    setOutput(`(AES Encrypted) ${input}`);
  };

  const handleDecrypt = () => {
    // Placeholder for AES decryption logic
    setOutput(`(AES Decrypted) ${input}`);
  };

  const handleGenerateKey = () => {
    // Placeholder for key generation
    setKey("Generated-Super-Secret-AES-Key-12345");
  }

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
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
            <CardTitle>Output</CardTitle>
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
              placeholder="Encrypted/decrypted result..."
              className="min-h-[200px] font-mono bg-muted/50"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="key-size">Key Size (bits)</Label>
              <Select defaultValue="256">
                <SelectTrigger id="key-size">
                  <SelectValue placeholder="Select key size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="128">128-bit</SelectItem>
                  <SelectItem value="192">192-bit</SelectItem>
                  <SelectItem value="256">256-bit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mode">Mode of Operation</Label>
              <Select defaultValue="gcm">
                <SelectTrigger id="mode">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gcm">GCM</SelectItem>
                  <SelectItem value="cbc">CBC</SelectItem>
                  <SelectItem value="ctr">CTR</SelectItem>
                  <SelectItem value="ecb">ECB (Not Recommended)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="aes-key">Secret Key</Label>
            <div className="flex gap-2">
              <Input
                id="aes-key"
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter or generate a key"
                className="font-mono"
              />
              <Button onClick={handleGenerateKey}><Wand2 className="mr-2 h-4 w-4" /> Generate</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="iv">Initialization Vector (IV) / Nonce</Label>
            <Input
              id="iv"
              type="text"
              value={iv}
              onChange={(e) => setIv(e.target.value)}
              placeholder="Required for most modes (auto-generated if empty)"
              className="font-mono"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center gap-4">
        <Button size="lg" onClick={handleEncrypt}>Encrypt</Button>
        <Button size="lg" variant="secondary" onClick={handleDecrypt}>Decrypt</Button>
      </div>
    </div>
  );
}
