export const ENDPOINTS = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        refresh: '/auth/refresh',
        logout: '/auth/logout',
    },
    user: {
        delete: "/user/delete", //Didn't implement the service.
        me: "/user/me"
    },
    habit: {
        create: "/habit/create",
        update: "/habit/update",
        delete: "/habit/delete",
        getAllByUser: "/habit/getAllByUser",
        getById: "/habit/getById",
        habitComplete: "/habit/habitComplete",
    }
}