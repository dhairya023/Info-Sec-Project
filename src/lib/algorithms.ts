import {
  ALargeSmall,
  Rotate3d,
  RotateCw,
  KeyRound,
  Key,
  LockKeyhole,
  Shield,
  Hash,
  PenSquare,
  type LucideIcon,
} from "lucide-react";

export type AlgorithmDifficulty = "Beginner" | "Intermediate" | "Advanced";
export type AlgorithmCategory = "Beginner" | "Intermediate" | "Advanced" | "Hashing" | "Signatures";
export type AlgorithmId = 'caesar' | 'substitution' | 'rot13' | 'aes' | 'des' | 'rsa' | 'blowfish' | 'hashing' | 'signatures';

export type Algorithm = {
  id: AlgorithmId;
  name: string;
  description: string;
  difficulty: AlgorithmDifficulty;
  category: AlgorithmCategory;
  icon: LucideIcon;
};

export const algorithms: Algorithm[] = [
  {
    id: 'caesar',
    name: 'Caesar Cipher',
    description: 'Simple letter substitution.',
    difficulty: 'Beginner',
    category: 'Beginner',
    icon: Rotate3d,
  },
  {
    id: 'substitution',
    name: 'Substitution Cipher',
    description: 'Each letter maps to another.',
    difficulty: 'Beginner',
    category: 'Beginner',
    icon: ALargeSmall,
  },
  {
    id: 'rot13',
    name: 'ROT13',
    description: 'A Caesar cipher with a fixed shift of 13.',
    difficulty: 'Beginner',
    category: 'Beginner',
    icon: RotateCw,
  },
  {
    id: 'aes',
    name: 'AES',
    description: 'Modern symmetric encryption standard.',
    difficulty: 'Intermediate',
    category: 'Intermediate',
    icon: KeyRound,
  },
  {
    id: 'des',
    name: 'DES/3DES',
    description: 'Legacy symmetric algorithm.',
    difficulty: 'Intermediate',
    category: 'Intermediate',
    icon: Key,
  },
  {
    id: 'rsa',
    name: 'RSA',
    description: 'Popular asymmetric encryption.',
    difficulty: 'Advanced',
    category: 'Advanced',
    icon: LockKeyhole,
  },
  {
    id: 'blowfish',
    name: 'Blowfish',
    description: 'Fast symmetric block cipher.',
    difficulty: 'Advanced',
    category: 'Advanced',
    icon: Shield,
  },
  {
    id: 'hashing',
    name: 'Hash Functions',
    description: 'Visualize MD5, SHA-1, SHA-256.',
    difficulty: 'Intermediate',
    category: 'Hashing',
    icon: Hash,
  },
    {
    id: 'signatures',
    name: 'Digital Signatures',
    description: 'Sign and verify messages.',
    difficulty: 'Advanced',
    category: 'Signatures',
    icon: PenSquare,
  },
];
