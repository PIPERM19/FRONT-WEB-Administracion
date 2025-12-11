export interface UserProject {
    id: string;
    name: string;
    status: string;
    end: string;
}

export interface UserProfileResponse {
    id: number;
    name: string;
    email: string;
    role: number; // 0, 1, 2, etc.
    phone: string | null; // Puede ser null
    active: boolean;
    projects: UserProject[];
}