import axios from 'axios'



const api = axios.create({
    baseURL: "http://127.0.0.1:8000/",
    withCredentials : true,
});

const AUTH_EXCLUDED = [
    "user-authentications/signup/worker/user/",
    "user-authentications/signup/employer/",
    "user-authentications/auth/user/login/",
    "user-authentications/password-reset/user/",
    "user-authentications/password/confirm/users/",
    "user-authentications/verify-email/",
    "user-authentications/auth/user-csrf/",
    
]

api.interceptors.request.use(
    (config) => {
        const csrfCookie = document.cookie.split("; ").find((cook)=> cook.startsWith("csrftoken="));

        if (csrfCookie){
            const csrfToken = csrfCookie.split("=")[1];
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
    },
    (error)=> Promise.reject(error)
);

let isRefresh = false;
let failedQueue = [];

const processQueue = (error, token=null)=>{
    failedQueue.forEach((prom)=>{
        if (error){
            prom.reject(error);
        }else{
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,

    async (error)=>{
        const originalRequest = error.config;

        if (AUTH_EXCLUDED.some(url => originalRequest.url.includes(url))){
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry){
            if (isRefresh){
                return new Promise((resolve, reject)=>{
                    failedQueue.push({resolve, reject});
                })
                .then(()=> api(originalRequest))
                .catch((error)=> Promise.reject(error));
            }
            originalRequest._retry = true;
            isRefresh= true;

            try{
                await api.post("user-authentications/refresh/users/",{},{withCredentials: true});
                processQueue(null);
                return api(originalRequest);
            } catch(error){
                processQueue(error, null);
                return Promise.reject(error);
            }finally{
                isRefresh = false;
            }
        }
        return Promise.reject(error);
    }
)


export default api;