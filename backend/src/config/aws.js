//This code handles AWS Configuration
//configuration for aws

const AWS = require('aws-sdk');

const awsConfig = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

AWS.config.update(awsConfig);

const kms = new AWS.KMS();
module.exports = { kms };



