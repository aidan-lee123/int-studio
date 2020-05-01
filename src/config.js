const dev = {
  s3: {
    REGION: "ap-southeast-2",
    BUCKET: "int-studio-website"
  },
  apiGateway: {
    REGION: "ap-southeast-2",
    URL: "https://rxxuvqzm9d.execute-api.ap-southeast-2.amazonaws.com/dev"
  },
  cognito: {
    REGION: "ap-southeast-2",
    USER_POOL_ID: "ap-southeast-2_sJCpfOPXQ",
    APP_CLIENT_ID: "7k1g14fln33vqrhnscih927f24",
    IDENTITY_POOL_ID: "ap-southeast-2:cfe0c817-d3c4-49dc-9745-4abc0500f964"
  }
}

const prod = {
  s3: {
    REGION: "ap-southeast-2",
    BUCKET: "int-studio-website"
  },
  apiGateway: {
    REGION: "ap-southeast-2",
    URL: "https://ls8iq2wfgc.execute-api.ap-southeast-2.amazonaws.com/dev"
  },
  cognito: {
    REGION: "ap-southeast-2",
    USER_POOL_ID: "ap-southeast-2_sJCpfOPXQ",
    APP_CLIENT_ID: "7k1g14fln33vqrhnscih927f24",
    IDENTITY_POOL_ID: "ap-southeast-2:cfe0c817-d3c4-49dc-9745-4abc0500f964"
  }
}

const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
  