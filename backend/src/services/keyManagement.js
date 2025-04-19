const crypto = require('crypto');
const { kms } = require('../config/aws');

class KeyManagementService {
    constructor() {
        if (!process.env.AWS_KMS_MASTER_KEY_ID) {
            throw new Error('AWS_KMS_MASTER_KEY_ID is not configured');
        }
        this.AWS_KMS_MASTER_KEY_ID = process.env.AWS_KMS_MASTER_KEY_ID;
    }

    async generateUserRootKey(userId) {
        if (!userId) {
            throw new Error('Invalid userId provided for root key generation');
        }
    
        try {
            console.log('Generating root key for user:', userId);
            const params = {
                KeyId: this.AWS_KMS_MASTER_KEY_ID,
                KeySpec: 'AES_256'
            };

            const { Plaintext, CiphertextBlob } = await kms.generateDataKey(params).promise();
            
            const userKeyId = crypto.createHash('sha256')
                .update(userId)
                .digest('hex');

            console.log('Root key generated successfully');
            return {
                userKeyId,
                encryptedRootKey: CiphertextBlob
            };
        } catch (error) {
            console.error('Root key generation error:', error);
            throw new Error(`Failed to generate user root key: ${error.message}`);
        }
    }

    async getRootKey(encryptedRootKey) {
        try {
            const { Plaintext } = await kms.decrypt({
                CiphertextBlob: encryptedRootKey
            }).promise();

            return Plaintext;
        } catch (error) {
            console.error('Root key retrieval error:', error);
            throw new Error(`Failed to decrypt root key: ${error.message}`);
        }
    }
}

module.exports = new KeyManagementService();