import { IDomanda } from "./dati-richiesti.interface";

export interface TableColumn {
    key: keyof IDomanda  | string | 'action' | 'button'; 
    header: string;
    class?: string;
    isCheckbox?: boolean;
    sortable?: boolean;
    isActionColumn?: boolean;
  }