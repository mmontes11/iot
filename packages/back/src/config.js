const { BASIC_AUTH_USER, BASIC_AUTH_PASSWORD } = process.env;

const config = {
  basicAuthUsers: {
    [BASIC_AUTH_USER]: BASIC_AUTH_PASSWORD,
  },
};

export default config;
