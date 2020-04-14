import { Characteristics } from './Characteristics.interface';
import { Age } from './Age.interface';

export interface Citizien{
    uid: string,
    pseudo: string,
    age: Age,
    country: string,
    characteristics: Characteristics,
}