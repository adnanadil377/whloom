import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Create a new Axios instance
const apiClient = axios.create({
    baseURL: '/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Flag to prevent multiple refresh calls
let isRefreshing = false;
// Queue of failed requests to retry after refresh
let failedQueue: any[] = [];

const processQueue = (error: any) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });

    failedQueue = [];
};

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If error is 401 and not a retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, add to queue
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to refresh token
                await axios.post('/api/v1/auth/refresh', {}, { withCredentials: true });

                // If successful, process queue and retry original
                processQueue(null);
                return apiClient(originalRequest);
            } catch (refreshError) {
                // If refresh fails, process queue with error
                processQueue(refreshError);

                // Optional: Redirect to login or clear auth state
                // window.location.href = '/login'; 
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
