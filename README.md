# Secure PDF Locker

This is a Next.js application that provides a secure, client-side platform to lock and unlock PDF files using AES-256-GCM encryption.

## Key Features

- **AES-256-GCM Encryption**: Military-grade encryption standard.
- **PBKDF2 Key Derivation**: Securely derives encryption keys from user passwords with 100,000 iterations and a random salt.
- **Client-Side Only**: All cryptographic operations happen in the user's browser. No files or passwords are ever sent to a server.
- **Zero-Knowledge**: Complete privacy for user data.
- **Secure Password Generation**: Creates a cryptographically secure 32-character password.
- **Minimalist UI**: A clean, professional, and responsive user interface built with Tailwind CSS and shadcn/ui.
- **Drag & Drop**: Easy file uploads.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
