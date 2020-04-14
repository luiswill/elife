import { Characteristics } from './Characteristics.interface';
import { Age } from './Age.interface';

export interface Citizien{
    uid: string,
    pseudo: string,
    age: Age,
    money: number,
    country: string,
    characteristics: Characteristics,
}