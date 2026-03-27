import { calculateFinalPosition } from "./calculateFinalPosition.js";
import { minTileIndex,maxTileIndex } from "../../constants.js";
import{metadata as rows} from "../Map.js";
import { min } from "three/tsl";


export function endsUpInValidPosition(currentPosition, move) {
// Calculate where the player would end up after the move
    const finalPosition = calculateFinalPosition(currentPosition, move);

    //Detect if we hit the edge if the board
    if(
        finalPosition.rowIndex === -1 ||
        finalPosition.tileIndex === minTileIndex -1 ||
        finalPosition.tileIndex === maxTileIndex + 1 
    ){
        // Invalid move, ignore move command
        return false;
    }

    //Detect if we hit a tree
    const finalRow=rows[finalPosition.rowIndex-1];
    if (
        finalRow &&
        finalRow.type === "forest" &&
        finalRow.trees.some(
            (tree) => tree.tileIndex === finalPosition.tileIndex
        )
    ){
        // Invalid move, ignore move command
        return false;
    }
    return true;
}