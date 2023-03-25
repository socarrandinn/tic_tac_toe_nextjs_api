import { JUGADOR_ENUM } from "./play.enum"

export interface IPlay{
  partidaId: string,
  estadoTablero: string[],
  siguienteMovimiento: IMovimiento 
  historial:IMovimiento[],
  isBot: boolean,
  currentPlayer: JUGADOR_ENUM,
  winner: string | null
}

export interface IMovimiento{
  caracter: string,
  posicion: number,
  deshacer?:boolean
}