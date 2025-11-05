import { algorithms, AlgorithmId } from "@/lib/algorithms";
import { AESCipher } from "./ciphers/aes";
import { CaesarCipher } from "./ciphers/caesar";
import { ComingSoon } from "./ciphers/coming-soon";
import { RSACipher } from "./ciphers/rsa";

const componentMap: Record<AlgorithmId, React.ComponentType<any>> = {
  // Beginner
  'caesar': CaesarCipher,
  'substitution': () => <ComingSoon name="Substitution Cipher" />,
  'rot13': () => <ComingSoon name="ROT13" />,
  // Intermediate
  'aes': AESCipher,
  'des': () => <ComingSoon name="DES/3DES" />,
  // Advanced
  'rsa': RSACipher,
  'blowfish': () => <ComingSoon name="Blowfish" />,
  // Hashing
  'hashing': () => <ComingSoon name="Hash Functions" />,
  // Signatures
  'signatures': () => <ComingSoon name="Digital Signatures" />,
};

export function Workspace({ algorithm }: { algorithm: string }) {
  const currentAlgorithm = algorithms.find((a) => a.id === algorithm);
  const ComponentToRender = componentMap[algorithm as AlgorithmId] || (() => <ComingSoon name="Unknown" />);

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">{currentAlgorithm?.name}</h1>
      <p className="text-muted-foreground mb-6">{currentAlgorithm?.description}</p>
      <ComponentToRender />
    </div>
  );
}
