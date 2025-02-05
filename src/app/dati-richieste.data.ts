import { IDomanda, StateEnum, IUser } from "./interfaces/dati-richiesti.interface";
import { SessionService } from "./session.service";

export let domanda: IDomanda[] = [];

export function initializeIDomanda(sessionService: SessionService) {
  
  const fetchedUser: IUser = sessionService.user; // Usa l'utente loggato

  var domanda: any[] = [];
}

function cloneUser(user: IUser): IUser {
  return { ...user }; 
}
