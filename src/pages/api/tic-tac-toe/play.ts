import { IMovimiento, IPlay } from "@/constant/play.interface";
import { v4 as uuidv4, validate } from "uuid";
import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { CurrentPlayer, IsBot, CalculateWinner, moveForWin } from "@/utils/utils";
import { JUGADOR_ENUM } from "@/constant/play.enum";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IPlay | { message: string } | { error: string }>
) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  const requestMethod = req.method;
  let myuuid = uuidv4();
  const body = req.body;

  switch (requestMethod) {
    case "POST": {
      if (validate(body?.partidaId)) {
        const currentPlayer =  body.currentPlayer === JUGADOR_ENUM.X ? JUGADOR_ENUM.O : JUGADOR_ENUM.X;   

        //calcular ganador
        const winner = await CalculateWinner(body.estadoTablero, body?.isBot, body?.siguienteMovimiento)

        console.log("resultado", winner)

        return res.status(200).json({
          ...body,
          currentPlayer: currentPlayer,
          estadoTablero: winner?.tablero,
          historial: [...body.historial, body.siguienteMovimiento],
          winner: winner.winner
        });
      } else {
        const isBot = IsBot();
        let currentPlayer = CurrentPlayer();
        let tablero = body.estadoTablero;
        let historial= [] as IMovimiento[]

        //empieza bot primer turno
        if (isBot) {
          currentPlayer = currentPlayer === JUGADOR_ENUM.X ? JUGADOR_ENUM.O : JUGADOR_ENUM.X;
          tablero = moveForWin(tablero, currentPlayer)         
          historial = [{
            caracter: body.currentPlayer,
            posicion:tablero?.find((p:string) => (p === JUGADOR_ENUM.X || p === JUGADOR_ENUM.O) )
          }] 
        }

        return res.status(200).json({
          ...body,
          partidaId: myuuid,
          estadoTablero: tablero,
          currentPlayer,
          isBot,
          historial
        });
      }
    }

    // handle other HTTP methods
    default:
      res.status(400).json({ error: "Not Found" });
  }
}
