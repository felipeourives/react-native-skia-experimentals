import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://nenhuma50-dev-ed.develop.my.salesforce.com/services/data/v59.0/',
  headers: {
    'Content-Type': 'application/json',
  }
});

export const retrieveAcesssToken = async () => {

  const oauthUrl = 'https://login.salesforce.com/services/oauth2/token';

  const payload = {
    grant_type: 'password',
    client_id: process.env.EXPO_PUBLIC_SF_CLIENT_ID,
    client_secret: process.env.EXPO_PUBLIC_SF_CLIENT_SECRET,
    username: process.env.EXPO_PUBLIC_SF_USER,
    password: process.env.EXPO_PUBLIC_SF_PASSWORD
  };

  const authResponse = await axios.post(oauthUrl, new URLSearchParams(payload), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return authResponse.data.access_token;
}

instance.interceptors.request.use(
  async (config) => {
    const token = await retrieveAcesssToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
