import { WINNES_LIST } from "@/constant/play.const";
import { JUGADOR_ENUM } from "@/constant/play.enum";
import { IMovimiento } from "@/constant/play.interface";


//verificar si existe un ganador
export const CalculateWinner = async (tablero: string[], movimiento: IMovimiento) => {
  const botPlayer = movimiento?.caracter === JUGADOR_ENUM.X ? JUGADOR_ENUM.O : JUGADOR_ENUM.X
  let addHistorial = [movimiento]

  //siguiente movimiento
  let nuevoTablero = [...tablero]
  nuevoTablero[movimiento.posicion] = movimiento.caracter
  const winner = Winner(nuevoTablero)
  
  //jugada del bots
  if (winner.winner === null) {
    const newTablero = moveForWin(nuevoTablero, botPlayer)        
    const winner = Winner(newTablero.tablero)
    addHistorial = [...addHistorial, newTablero.historial]
    return {
      winner: winner.winner,
      tablero: winner.tablero,
      historial:addHistorial
    }
  }

  return {
    winner: winner.winner,
    tablero: winner.tablero,
    historial:addHistorial
  }
}


export const moveForWin = (tablero: string[], player: JUGADOR_ENUM | '-') => {
  let possibleWins = [];
  let otherPlayer = OtherPlayer(player);

  //posible victoria del jugador
  for (let i = 0; i < WINNES_LIST.length; i++) {
    const [a, b, c] = WINNES_LIST[i];
    // Si dos de los espacios de la victoria están ocupados por el jugador
    if (tablero[a] === player && tablero[b] === player && tablero[c] === "-") {
      // Colocar la marca del jugador en el espacio libre para ganar
      tablero[c] = player;
      return {
        tablero,
        historial:{
          caracter: player,
          posicion: c   
        }
      }
    } else if (tablero[a] === player && tablero[c] === player && tablero[b] === "-") {
      tablero[b] = player;
      return {
        tablero,
        historial:{
          caracter: player,
          posicion: b   
        }
      }
    } else if (tablero[b] === player && tablero[c] === player && tablero[a] === "-") {
      tablero[a] = player;
      return {
        tablero,
        historial:{
          caracter: player,
          posicion: a   
        }
      }
    } else if (tablero[a] === "-" && tablero[b] === player && tablero[c] === player) {
      possibleWins.push(a);
    } else if (tablero[a] === player && tablero[b] === "-" && tablero[c] === player) {
      possibleWins.push(b);
    } else if (tablero[a] === player && tablero[b] === player && tablero[c] === "-") {
      possibleWins.push(c);
    }
  }

  // evitar victoria del oponente
  for (let i = 0; i < WINNES_LIST.length; i++) {
    const [a, b, c] = WINNES_LIST[i];
    // Si dos de los espacios de la victoria están ocupados por el otro jugador
    if (tablero[a] === otherPlayer && tablero[b] === otherPlayer && tablero[c] === "-") {
      // Colocar la marca del jugador en el espacio libre para ganar
      tablero[c] = player;
      return {
        tablero,
        historial:{
          caracter: player,
          posicion: c   
        }
      }     
      
    } else if (tablero[a] === otherPlayer && tablero[c] === otherPlayer && tablero[b] === "-") {
      tablero[b] = player;
      return {
        tablero,
        historial:{
          caracter: player,
          posicion: b   
        }
      }
    } else if (tablero[b] === otherPlayer && tablero[c] === otherPlayer && tablero[a] === "-") {
      tablero[a] = player;
      return {
        tablero,
        historial:{
          caracter: player,
          posicion: a  
        }
      }
    } else if (tablero[a] === "-" && tablero[b] === otherPlayer && tablero[c] === otherPlayer) {
      possibleWins.push(a);
    } else if (tablero[a] === otherPlayer && tablero[b] === "-" && tablero[c] === otherPlayer) {
      possibleWins.push(b);
    } else if (tablero[a] === otherPlayer && tablero[b] === otherPlayer && tablero[c] === "-") {
      possibleWins.push(c);
    }
  }

  // Si no se encontró una jugada para ganar, jugar una jugada aleatoria
  if (possibleWins.length > 0) {   
    const randomIndex = Math.floor(Math.random() * possibleWins.length);
    tablero[possibleWins[randomIndex]] = player;
    return {
      tablero,
      historial:{
        caracter: player,
        posicion: possibleWins[randomIndex]  
      }
    }
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
      return {
        tablero,
        historial:{
          caracter: player,
          posicion: emptySpaces[randomIndex] 
        }
      }
    }
  }

  // Si no se encontró una jugada para ganar y no hay espacios libres, devolver el tablero sin cambios
  return {
    tablero,
    historial:{
      caracter: 'E',
      posicion: -1 
    }
  }
}





// obtener el ganador y actualizar tablero
const Winner = (tablero: string[]) => {
  for (let i = 0; i < WINNES_LIST.length; i++) {
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

//obtener jugador contario
export const OtherPlayer = (player: string) => {
  return player === JUGADOR_ENUM.X ? JUGADOR_ENUM.O : JUGADOR_ENUM.X
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
