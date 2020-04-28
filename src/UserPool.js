import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'ap-southeast-2_sJCpfOPXQ',
  ClientId: '7k1g14fln33vqrhnscih927f24'
};

export default new CognitoUserPool(poolData);