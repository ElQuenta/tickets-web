export interface User {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    sessionStart: Date;
    username: string;
    roles: string[];
}