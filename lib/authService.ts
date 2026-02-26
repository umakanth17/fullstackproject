
export interface User {
    email: string;
    password?: string; // Optional for security when returning user object
    fullName: string;
    mobile: string;
    role: string;
    emailVerified?: boolean;
    // Add other fields as needed
}

const USER_STORAGE_KEY = 'foodseeker_users';

export const getUsers = (): User[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const registerUser = (user: User): { success: boolean; message: string } => {
    const users = getUsers();

    // Check if email already exists
    if (users.some(u => u.email === user.email)) {
        return { success: false, message: 'Email already registered. Please login.' };
    }

    // Add new user
    users.push(user);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
    return { success: true, message: 'Registration successful!' };
};

export const loginUser = (email: string, password: string): { success: boolean; message: string; user?: User } => {
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        return { success: false, message: 'Account does not exist. Please register.' };
    }

    if (user.password !== password) {
        return { success: false, message: 'Invalid password.' };
    }

    return { success: true, message: 'Login successful!', user };
};

export const checkUserExists = (email: string): boolean => {
    const users = getUsers();
    return users.some(u => u.email === email);
};
