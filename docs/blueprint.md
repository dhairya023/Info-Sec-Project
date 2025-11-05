# **App Name**: CryptoLab

## Core Features:

- Algorithm Library: Includes Caesar, Substitution, ROT13, AES, DES/3DES, RSA, and Blowfish algorithms for encryption and decryption.
- Encryption/Decryption Workspace: Provides an interface for text input, key configuration, and encrypted/decrypted output.
- Interactive Learning Modules: Offers 'How It Works' sections with animated diagrams, analogies, and historical context for each algorithm.
- Hash Function Visualizer: Allows visualization of MD5, SHA-1, SHA-256, and SHA-512 hash functions, with collision demonstration and file hashing.
- Digital Signature Simulator: Simulates signing messages with a private key and verifying signatures with a public key, providing a visual explanation of the process.
- Key Generator: Generates secure random keys with a strength meter and export options in various formats, including QR code representation.
- User Progress Tracking: Utilizes Firestore to store user progress, saved encryptions, and leaderboard data.

## Style Guidelines:

- Primary color: Deep purple/blue (#6366F1) to convey trust and security.
- Accent color: Amber (#F59E0B) to indicate a warning for potentially weak security settings. 
- Background color: Light purple/blue (#E2E3F3), slightly desaturated, complements the primary while ensuring readability and focus.
- Body font: 'Inter', a sans-serif for clean, modern text rendering.
- Headline font: 'Space Grotesk', for short texts. If long text is anticipated use Inter for body
- Animated locks that open and close based on encrypt/decrypt actions.
- Glassmorphism cards for algorithm selection in the sidebar.