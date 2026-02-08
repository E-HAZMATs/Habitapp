interface user{
    id: string,
    username: string,
    email: string,
    role: string,
    timezone: string,
    isSystemUser: boolean,
    createdAt: string,
    updatedAt: string,
}

interface UpdateProfileDto {
    email?: string;
    timezone?: string;
    currentPassword?: string;
    newPassword?: string;
}