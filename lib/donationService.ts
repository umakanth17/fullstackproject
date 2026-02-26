
export interface Donation {
    id: string;
    item: string;
    quantity: string;
    date: string;
    expiration: string;
    foodType: string;
    location: string;
    donor: string;
    status: 'Available' | 'Completed' | 'Distributed';
    requestor?: string;
}

const STORAGE_KEY = 'foodseeker_donations';

export const getDonations = (): Donation[] => {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        // Return default data if storage is empty
        const defaultData: Donation[] = [
            { id: '1', item: 'Fresh Fruits Mix', quantity: '10 kg', date: '2023-10-25', expiration: '2023-10-30', foodType: 'Fresh Produce', location: 'Downtown', donor: 'Whole Foods Market', status: 'Available' },
            { id: '2', item: 'Bakery Surplus', quantity: '5 kg', date: '2023-10-25', expiration: '2023-10-26', foodType: 'Baked Goods', location: 'Uptown', donor: 'Corner Bakery', status: 'Available' },
            { id: '3', item: '50kg Apples', quantity: '50 kg', date: '2023-10-24', expiration: '2023-11-01', foodType: 'Fresh Produce', location: 'Warehouse A', donor: 'Donor User', status: 'Completed', requestor: 'Hope Shelter' },
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
        return defaultData;
    }

    return JSON.parse(stored);
};

export const addDonation = (donation: Omit<Donation, 'id' | 'status' | 'donor'>) => {
    const donations = getDonations();
    const newDonation: Donation = {
        ...donation,
        id: Date.now().toString(),
        status: 'Available',
        donor: 'Donor User', // Hardcoded for this demo context
    };

    const updated = [newDonation, ...donations];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newDonation;
};

export const getDonationsByRole = (role: 'donor' | 'recipient') => {
    const donations = getDonations();
    if (role === 'donor') {
        // In a real app, filter by current user ID. Here we just show all or filter by our hardcoded 'Donor User'
        return donations.filter(d => d.donor === 'Donor User');
    }
    // Recipients see all available
    return donations.filter(d => d.status === 'Available');
};
