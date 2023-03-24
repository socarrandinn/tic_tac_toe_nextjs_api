import { WINNES_LIST } from "@/constant/play.const";
import { JUGADOR_ENUM } from "@/constant/play.enum";
import { IMovimiento } from "@/constant/play.interface";


//verificar si existe un ganador
export const CalculateWinner = async(tablero: string[], isBot: boolean, movimiento: IMovimiento) => {
  const botPlayer = movimiento?.caracter === JUGADOR_ENUM.X ? JUGADOR_ENUM.O :JUGADOR_ENUM.X

  //siguiente movimiento
  let nuevoTablero = [...tablero]
  nuevoTablero[movimiento.posicion] = movimiento.caracter
  const winner = Winner(nuevoTablero)

  if(winner.winner === null){
    const newTablero = moveForWin(nuevoTablero, botPlayer)
    return Winner(newTablero)
  }

  return winner
}

export const moveForWin = (tablero: string[], player:JUGADOR_ENUM | '-') => {
  let possibleWins = [];
  // Iterar sobre la lista de posibles victorias
  for (let i = 0; i < WINNES_LIST.length; i++) {
    const [a, b, c] = WINNES_LIST[i];
    // Si dos de los espacios de la victoria están ocupados por el jugador
    if (tablero[a] === player && tablero[b] === player && tablero[c] === "-") {
      // Colocar la marca del jugador en el espacio libre para ganar
      tablero[c] = player;
      return tablero;
    } else if (tablero[a] === player && tablero[c] === player && tablero[b] === "-") {
      tablero[b] = player;
      return tablero;
    } else if (tablero[b] === player && tablero[c] === player && tablero[a] === "-") {
      tablero[a] = player;
      return tablero;
    } else if (tablero[a] === "-" && tablero[b] === player && tablero[c] === player) {
      possibleWins.push(a);
    } else if (tablero[a] === player && tablero[b] === "-" && tablero[c] === player) {
      possibleWins.push(b);
    } else if (tablero[a] === player && tablero[b] === player && tablero[c] === "-") {
      possibleWins.push(c);
    }
  }
  
  // Si no se encontró una jugada para ganar, jugar una jugada aleatoria
  if (possibleWins.length > 0) {
    const randomIndex = Math.floor(Math.random() * possibleWins.length);
    tablero[possibleWins[randomIndex]] = player;
    return tablero;
  } else {
    const emptySpaces = [];
    for (let i = 0; i < tablero.length; i++) {
      if (tablero[i] === "-") {
        emptySpaces.push(i);
      }
    }
    if (emptySpaces.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptySpaces.length);
      tablero[emptySpaces[randomIndex]] = player;
      return tablero;
    }
  }
  
  // Si no se encontró una jugada para ganar y no hay espacios libres, devolver el tablero sin cambios
  return tablero;
}



// obtener el ganador y actualizar tablero
const Winner = (tablero: string[]) => {   

  for (let i=0; i< WINNES_LIST.length; i++ ){
    const [p1, p2, p3] = WINNES_LIST[i]
    if (tablero[p1] && tablero[p1] === tablero[p2] && tablero[p2] === tablero[p3] && (tablero[p1] === JUGADOR_ENUM.X || tablero[p1] === JUGADOR_ENUM.O)) {      
      return {
        winner: tablero[p1],
        tablero: tablero
      }
    }  
  }
  return {
    winner: null,
    tablero: tablero
  }
  
}


//get current player
export const CurrentPlayer = () => {
  const player = Math.round(Math.random() * 1) === 1 ? JUGADOR_ENUM.X : JUGADOR_ENUM.O
  return player
}

//get current player
export const IsBot = () => {
  const bot = Math.round(Math.random() * 1) === 1 ? true : false
  return bot
}
