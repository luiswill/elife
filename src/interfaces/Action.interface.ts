import { Characteristics } from './Characteristics.interface';

export interface Action {
    ageAvailable: number,
    description: string,
    id: number,
    name: string,
    effects: Characteristics
}