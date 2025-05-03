
/**
 * Encryption Service
 * 
 * Provides utilities for encrypting and decrypting sensitive data.
 * Uses the Web Crypto API for secure cryptographic operations.
 */

// Helper to convert string to Buffer
const str2ab = (str: string) => {
  const buf = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    buf[i] = str.charCodeAt(i);
  }
  return buf;
};

// Helper to convert Buffer to string
const ab2str = (buf: ArrayBuffer) => {
  return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
};

// Helper to convert string to base64
const strToBase64 = (str: string) => {
  return btoa(str);
};

// Helper to convert base64 to string
const base64ToStr = (base64: string) => {
  return atob(base64);
};

/**
 * Generates a random encryption key
 */
export const generateEncryptionKey = async (): Promise<CryptoKey> => {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
};

/**
 * Exports a crypto key to a base64 string
 */
export const exportKey = async (key: CryptoKey): Promise<string> => {
  const exportedKey = await window.crypto.subtle.exportKey('raw', key);
  return strToBase64(ab2str(exportedKey));
};

/**
 * Imports a key from a base64 string
 */
export const importKey = async (keyStr: string): Promise<CryptoKey> => {
  const keyBuffer = str2ab(base64ToStr(keyStr));
  return await window.crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
};

/**
 * Encrypts data with AES-GCM
 * @param data The data to encrypt (string)
 * @param key The encryption key (CryptoKey)
 * @returns An object with iv and ciphertext (both base64 strings)
 */
export const encryptData = async (data: string, key: CryptoKey): Promise<{ iv: string; ciphertext: string }> => {
  try {
    // Generate a random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the data
    const encodedData = new TextEncoder().encode(data);
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encodedData
    );
    
    // Convert to base64 for storage
    const ivString = strToBase64(ab2str(iv));
    const ciphertextString = strToBase64(ab2str(encryptedData));
    
    return {
      iv: ivString,
      ciphertext: ciphertextString,
    };
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypts data encrypted with AES-GCM
 * @param encryptedData Object with iv and ciphertext (both base64 strings)
 * @param key The decryption key (CryptoKey)
 * @returns The decrypted data as a string
 */
export const decryptData = async (
  encryptedData: { iv: string; ciphertext: string },
  key: CryptoKey
): Promise<string> => {
  try {
    // Convert from base64
    const iv = str2ab(base64ToStr(encryptedData.iv));
    const ciphertext = str2ab(base64ToStr(encryptedData.ciphertext));
    
    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      ciphertext
    );
    
    // Convert the decrypted data back to a string
    return new TextDecoder().decode(decryptedData);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Encrypts sensitive data with a password-based key
 * @param data The data to encrypt
 * @param password The password to derive the key from
 * @returns Object with salt, iv, and ciphertext (all base64)
 */
export const encryptWithPassword = async (
  data: string,
  password: string
): Promise<{ salt: string; iv: string; ciphertext: string }> => {
  try {
    // Generate a random salt
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    
    // Derive a key from the password
    const encodedPassword = new TextEncoder().encode(password);
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encodedPassword,
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    
    // Generate a random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the data
    const encodedData = new TextEncoder().encode(data);
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encodedData
    );
    
    // Convert to base64 for storage
    const saltString = strToBase64(ab2str(salt));
    const ivString = strToBase64(ab2str(iv));
    const ciphertextString = strToBase64(ab2str(encryptedData));
    
    return {
      salt: saltString,
      iv: ivString,
      ciphertext: ciphertextString,
    };
  } catch (error) {
    console.error('Password encryption failed:', error);
    throw new Error('Failed to encrypt data with password');
  }
};

/**
 * Decrypts data encrypted with a password-based key
 * @param encryptedData Object with salt, iv, and ciphertext (all base64)
 * @param password The password to derive the key from
 * @returns The decrypted data as a string
 */
export const decryptWithPassword = async (
  encryptedData: { salt: string; iv: string; ciphertext: string },
  password: string
): Promise<string> => {
  try {
    // Convert from base64
    const salt = str2ab(base64ToStr(encryptedData.salt));
    const iv = str2ab(base64ToStr(encryptedData.iv));
    const ciphertext = str2ab(base64ToStr(encryptedData.ciphertext));
    
    // Derive the key from the password
    const encodedPassword = new TextEncoder().encode(password);
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encodedPassword,
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    
    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      ciphertext
    );
    
    // Convert the decrypted data back to a string
    return new TextDecoder().decode(decryptedData);
  } catch (error) {
    console.error('Password decryption failed:', error);
    throw new Error('Failed to decrypt data with password');
  }
};

/**
 * Hashes a string using SHA-256
 */
export const hashString = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

/**
 * Simple utility to mask sensitive data for display
 * (e.g., "4111 1111 1111 1111" becomes "•••• •••• •••• 1111")
 */
export const maskSensitiveData = (data: string, visibleChars: number = 4): string => {
  if (!data) return '';
  if (data.length <= visibleChars) return data;
  
  const visible = data.slice(-visibleChars);
  const masked = '•'.repeat(data.length - visibleChars);
  
  // For credit card formatting
  if (data.length === 16 && !data.includes(' ')) {
    const maskedPart = '•••• •••• •••• ';
    return maskedPart + visible;
  }
  
  return masked + visible;
};
