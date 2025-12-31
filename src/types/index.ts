// This file contains TypeScript types and interfaces used throughout the application.

export interface WeddingDetails {
    date: string;
    time: string;
    location: string;
}

export interface InvitationMessage {
    coupleNames: string;
    message: string;
}

export interface Photo {
    id: string;
    url: string;
    description?: string;
}

export interface LocationDetails {
    address: string;
    directions: {
        driving: string;
        publicTransport: string;
    };
}

export interface AccountInfo {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
}

export interface GuestBookEntry {
    name: string;
    message: string;
    timestamp: Date;
}