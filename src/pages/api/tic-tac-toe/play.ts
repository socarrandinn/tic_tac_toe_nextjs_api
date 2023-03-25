import { IMovimiento, IPlay } from "@/constant/play.interface";
import { v4 as uuidv4, validate } from "uuid";
import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import {
  CurrentPlayer,
  IsBot,
  CalculateWinner,
  moveForWin,
} from "@/utils/utils";
import { JUGADOR_ENUM } from "@/constant/play.enum";
import { esValidoSiguienteMovimiento, onTableroAnterior } from "@/utils/validate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IPlay | { message: string } | { error: boolean }>
) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  const requestMethod = req.method;
  let myuuid = uuidv4();
  const body= req.body;

  switch (requestMethod) {
    case "POST": {
      try {
        if (validate(body?.partidaId)) {
          
          //validar siguiente movimiento
          const isValidMov = await esValidoSiguienteMovimiento(body?.estadoTablero, body?.siguienteMovimiento)
          if (!isValidMov) {
            return res.status(401).json({ error: true, message: "_Not valid move_" });
          } 
          
          //deshacer movimientos anteriores
          await onTableroAnterior(body, res)

          const winner = await CalculateWinner(
            body.estadoTablero,
            body?.siguienteMovimiento
          );
  
          return res.status(200).json({
            ...body,
            currentPlayer: body.currentPlayer,
            estadoTablero: winner.tablero,
            historial: [...body.historial, ...winner.historial],
            winner: winner.winner,
            siguienteMovimiento: null
          });
  
          //iniciar partida
        } else {
          if (body?.partidaId === "" || body?.partidaId === undefined) {
            const isBot = IsBot();
            let currentPlayer = CurrentPlayer();
            let tablero = body.estadoTablero || Array(9).fill('-');
            let historial = [] as IMovimiento[];
  
            //empieza bot primer turno
            if (isBot) {
              const newTablero = moveForWin(tablero, currentPlayer);
              tablero = newTablero.tablero;
              historial = [newTablero.historial];
            }
  
            //respuesta correcta
            return res.status(200).json({
              ...body,
              partidaId: myuuid,
              estadoTablero: tablero,
              currentPlayer: isBot
                ? currentPlayer === JUGADOR_ENUM.O
                  ? JUGADOR_ENUM.X
                  : JUGADOR_ENUM.O
                : currentPlayer,
              isBot,
              historial,
  
            });
          }else{
            res.status(400).json({error: true, message:'_Not valid matchId_'})
          }
        }
      } catch (error) {
        res.status(400).json({error: true, message:'error'})
        
      }
    }

    // handle other HTTP methods
    default:
      res.status(400).json({ error: true, message: "Not Found" });
  }
}
