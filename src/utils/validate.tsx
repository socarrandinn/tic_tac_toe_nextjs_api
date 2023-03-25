import { JUGADOR_ENUM } from "@/constant/play.enum";
import { IPlay } from "@/constant/play.interface";

export const esValidoSiguienteMovimiento = (tablero: string[], movimiento: any) => {
  try {
    if(movimiento.deshacer === true){
      return true
    }else{
      if (movimiento.posicion >= 0 && movimiento.posicion <= 8) {
        const caracter = tablero[movimiento.posicion]
        if (caracter === '-' && (movimiento.caracter === JUGADOR_ENUM.X || movimiento.caracter === JUGADOR_ENUM.O)) {
          return true
        }
      }
      return false
    }
  } catch (error) {
     return false
  }
}

export const onTableroAnterior = (body:IPlay, res: any) => {
  if(body.siguienteMovimiento.deshacer){
    let tableroAnterior = body.estadoTablero
    let historialAnterior = body.historial.slice(0,body.historial.length-2)
    const player1 = body.historial.at(-1)
    const player2 = body.historial.at(-2)
    if(!!player1){
      tableroAnterior[player1.posicion]='-'              
    }
    if(!!player2){
      tableroAnterior[player2.posicion]='-'
    }
    return res.status(200).json({
      ...body,
      estadoTablero: tableroAnterior,
      historial: historialAnterior
    });
  }
  return true
}