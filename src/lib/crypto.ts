const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16; // 128 bits
const IV_LENGTH = 12; // 96 bits for GCM

// Derives a key from a password and salt using PBKDF2
async function getKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const passwordBuffer = new TextEncoder().encode(password);
  const importedKey = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    importedKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

// Encrypts data using AES-256-GCM
export async function encrypt(
  data: ArrayBuffer,
  password: string
): Promise<ArrayBuffer> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await getKey(password, salt);

  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );

  // Combine salt, iv, and encrypted data into one buffer
  const result = new Uint8Array(
    salt.length + iv.length + encryptedData.byteLength
  );
  result.set(salt, 0);
  result.set(iv, salt.length);
  result.set(new Uint8Array(encryptedData), salt.length + iv.length);

  return result.buffer;
}

// Decrypts data using AES-256-GCM
export async function decrypt(
  encryptedData: ArrayBuffer,
  password: string
): Promise<ArrayBuffer> {
  const data = new Uint8Array(encryptedData);
  const salt = data.slice(0, SALT_LENGTH);
  const iv = data.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const encryptedContent = data.slice(SALT_LENGTH + IV_LENGTH);

  const key = await getKey(password, salt);

  try {
    const decryptedData = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encryptedContent
    );
    return decryptedData;
  } catch (error) {
    throw new Error("Decryption failed. Invalid password or corrupted file.");
  }
}

// Generates a cryptographically secure random password
export function generatePassword(): string {
  const length = 32;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*-_=+";
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }
  
  // Shuffle for more randomness
  const shuffleArray = new Uint32Array(length);
  crypto.getRandomValues(shuffleArray);
  password = password.split('').sort(() => (shuffleArray[0] % 3) - 1).join('');

  return password;
}
