export type PaneId = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'footer';

export interface PaneContent {
    type: string;
    title?: string;
    data?: any;
}

export interface PaneState {
    [key in PaneId]: PaneContent | null;
}

export function isPaneId(value: any): value is PaneId {
    return ['topLeft', 'topRight', 'bottomLeft', 'bottomCenter', 'bottomRight', 'footer'].includes(value);
}
