export interface ReservationFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    date: string; // ISO string côté client, converti en Date dans l'endpoint
    time: string;
    guests: number;
    message?: string;
    tableIds?: string[];
}
