import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import qs from 'qs';

const DEV_API_URL = 'http://localhost:3000';
const PRODUCTION_API_URL = 'https://api.kenmei.co';

const currentEnv = () => (
  process.env.NODE_ENV === 'production' ? PRODUCTION_API_URL : DEV_API_URL
);

const islogOutRequest = (request) => request.method === 'delete'
  && request.url.includes('sessions');

const setAuthConfig = (config) => {
  const token = localStorage.getItem('access');

  if (token) { config.headers.Authorization = `Bearer ${token}`; }

  return config;
};

const baseConfig = {
  baseURL: currentEnv(),
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  },
};

const secure = axios.create(baseConfig);
const plain  = axios.create(baseConfig);

const refreshAuthLogic = (failedRequest) => plain
  .post('/refresh')
  .then((response) => {
    const { access } = response.data;

    localStorage.access = access;
    failedRequest.response.config.headers.Authorization = `Bearer ${access}`;

    return Promise.resolve();
  }).catch(() => {
    delete localStorage.access;
    delete localStorage.vuex;

    if (islogOutRequest(failedRequest.config)) return Promise.resolve();

    window.location.reload(true);
  });

plain.interceptors.request.use((config) => setAuthConfig(config));
secure.interceptors.request.use((config) => setAuthConfig(config));

createAuthRefreshInterceptor(secure, refreshAuthLogic);

export { secure, plain };
