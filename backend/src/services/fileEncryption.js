const crypto = require('crypto');

class FileEncryptionService {
    constructor() {
        this.algorithm = 'aes-256-gcm';
        this.ivLength = 12;
        this.authTagLength = 16;
    }

    async encryptBuffer(buffer, rootKey) {
        try {
            if (!Buffer.isBuffer(buffer)) {
                throw new Error('Input must be a buffer');
            }

            if (!Buffer.isBuffer(rootKey) || rootKey.length !== 32) {
                throw new Error('Invalid root key');
            }

            const iv = crypto.randomBytes(this.ivLength);
            const cipher = crypto.createCipheriv(this.algorithm, rootKey, iv);
            
            const encrypted = Buffer.concat([
                cipher.update(buffer),
                cipher.final()
            ]);
            
            const authTag = cipher.getAuthTag();

            // Format: [IV (12 bytes)][Auth Tag (16 bytes)][Encrypted Data]
            return Buffer.concat([iv, authTag, encrypted]);
        } catch (error) {
            console.error('Encryption error:', error);
            throw new Error(`Encryption failed: ${error.message}`);
        }
    }

    async decryptBuffer(encryptedBuffer, rootKey) {
        try {
            if (!Buffer.isBuffer(encryptedBuffer)) {
                throw new Error('Input must be a buffer');
            }
    
            if (!Buffer.isBuffer(rootKey) || rootKey.length !== 32) {
                throw new Error('Invalid root key');
            }
    
            // Extract IV (12 bytes), Authentication Tag (16 bytes), and Encrypted Data
            const iv = encryptedBuffer.slice(0, this.ivLength);
            const authTag = encryptedBuffer.slice(this.ivLength, this.ivLength + this.authTagLength);
            const encryptedData = encryptedBuffer.slice(this.ivLength + this.authTagLength);
    
            // Create the decipher object using the same algorithm, rootKey, and IV
            const decipher = crypto.createDecipheriv(this.algorithm, rootKey, iv);
    
            // Set the auth tag to ensure integrity during decryption
            decipher.setAuthTag(authTag);
    
            // Decrypt the data and return the result
            return Buffer.concat([
                decipher.update(encryptedData),
                decipher.final()
            ]);
        } catch (error) {
            console.error('Decryption error:', error);
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }
}

module.exports = new FileEncryptionService();
