import { validate as validateUuid } from "uuid";
import { v4 as uuidV4} from 'uuid';


export class Uuid{
    private value : string;


    constructor(valueId: string){
        if (!validateUuid(valueId)) {
            throw new Error(`Valor não é válido para uuid: ${valueId}`)
        }
        
        this.value = valueId;
    }

    static randomGenerator(): Uuid{
        return new Uuid(uuidV4());
    }

    public getValue():string{
        return this.value;
    }
}