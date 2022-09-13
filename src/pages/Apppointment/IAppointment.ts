export interface Availability {
    available: number;
    date: string;
    day: string;
    month: string;
    label: string;
    total: number;
    unavailable: number;
    year: string;
}

export interface TimeSlots {
    from_unix: number;
    to_unix: number;
}

export interface Dates {
    availability: Availability;
    available: TimeSlots[];
    unavailable: TimeSlots[];
    timeSlots: TimeSlots[];
}