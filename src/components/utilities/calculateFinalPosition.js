
/*
We will check if a move is valid by calculating where it would take the player.

If the player would end up in a position outside of the map or  in a tile
occupied by a tree, we will ignore that move command. 

First, we need to calculate where  the player would end up if they made a move.
Whenever we add the new move to the queue, we need to calculate where the player
would end up if they made all the moves in the queue and take the  current move
command. We create a utility function  that takes the player's current position
and an array of moves and returns the player's final  position. We will use this
information to check  if the player can make that move. 
*/



export function calculateFinalPosition(currentPosition, move) {
    return move.reduce((position, direction) => {
        if (direction === "forward")
            return {
                rowIndex: position.rowIndex + 1,
                tileIndex: position.tileIndex
            };
        if (direction === "backward")
            return {
                rowIndex: position.rowIndex - 1,
                tileIndex: position.tileIndex
            };
        if (direction === "left")
            return {
                rowIndex: position.rowIndex,
                tileIndex: position.tileIndex - 1
            };
        if (direction === "right")
            return {
                rowIndex: position.rowIndex,
                tileIndex: position.tileIndex + 1
            };
        return position;
    }, currentPosition);
}