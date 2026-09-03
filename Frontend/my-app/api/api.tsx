import axios, {
    AxiosError,
    AxiosRequestConfig,
    InternalAxiosRequestConfig
} from "axios"

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/'

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean
}

type QueuedRequest = {
    resolve: (token: string) => void
    reject: (error: unknown) => void
}

let refreshPromise: Promise<string | null> | null = null
let requestQueue: QueuedRequest[] = []

const processQueue = (error: unknown, token: string | null) => {
    requestQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error)
        } else if (token) {
            resolve(token)
        }
    })

    requestQueue = []
}

const clearAuthAndRedirect = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')

    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.replace('/login')
    }
}

const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refreshToken')

    if (!refreshToken) {
        throw new Error('No refresh token available')
    }

    const response = await axios.post<{ access: string }>(
        `${API}token/refresh/`,
        { refresh: refreshToken }
    )
    console.log(response.data)

    localStorage.setItem('token', response.data.access)
    return response.data.access
}

export const instance = axios.create(
    {
        baseURL:`${API}`,
        headers: { 'Content-Type': 'application/json' }
    }
)

instance.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined'
        ? localStorage.getItem('token')
        : null

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes('token/refresh/')
        ) {
            return Promise.reject(error)
        }

        if (!localStorage.getItem('refreshToken')) {
            clearAuthAndRedirect()
            return Promise.reject(error)
        }

        originalRequest._retry = true

        const queuedToken = new Promise<string>((resolve, reject) => {
            requestQueue.push({ resolve, reject })
        })

        if (!refreshPromise) {
            refreshPromise = refreshAccessToken()
                .then((token) => {
                    processQueue(null, token)
                    return token
                })
                .catch((refreshError: AxiosError) => {
                    clearAuthAndRedirect()
                    processQueue(refreshError, null)
                    return null
                })
                .finally(() => {
                    refreshPromise = null
                })
        }

        try {
            const token = await queuedToken
            originalRequest.headers.Authorization = `Bearer ${token}`
            return instance(originalRequest as AxiosRequestConfig)
        } catch (queueError) {
            return Promise.reject(queueError)
        }
    }
)

