export default {
    MAX_ATTACHMENT_SIZE: 5000000,
    s3: {
      REGION: "ap-southeast-2",
      BUCKET: "int-studio-website"
    },
    apiGateway: {
      REGION: "ap-southeast-2",
      URL: "https://rxxuvqzm9d.execute-api.ap-southeast-2.amazonaws.com/dev/tasks"
    },
    cognito: {
      REGION: "ap-southeast-2",
      USER_POOL_ID: "ap-southeast-2_sJCpfOPXQ",
      APP_CLIENT_ID: "7k1g14fln33vqrhnscih927f24",
      IDENTITY_POOL_ID: "ap-southeast-2:cfe0c817-d3c4-49dc-9745-4abc0500f964"
    }
  };
  