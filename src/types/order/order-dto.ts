import type {
    AppointmentType,
    Carrier,
    EquipmentType,
    LoadType,
    OrderStatus,
    StopType,
} from "./order-types";

export interface StopDto {
    id: string;
    order: number;
    type: StopType;
    city: string;
    state: string;
    zip: string;
    appointmentDate: string | null;
    appointmentTime: string | null;
    appointmentType: AppointmentType;
    notes?: string;
}

export interface OrderDto {
    id: string;
    referenceNumber: string;
    status: OrderStatus;
    clientName: string;
    carrier: Carrier;
    equipmentType: EquipmentType;
    loadType: LoadType;
    stops: StopDto[];
    weight: number;
    rate: number;
    notes: string;
}


