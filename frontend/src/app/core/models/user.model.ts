export interface user {
    id: string,
    username: string,
    email: string,
    role: string,
    timezone: string,
    isSystemUser: boolean,
    createdAt: string,
    updatedAt: string,
}

export interface UpdateProfileDto {
    email?: string;
    username?: string;
    timezone?: string;
    currentPassword?: string;
    newPassword?: string;
}