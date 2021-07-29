import { ChessOutcomeTable } from "./chess-outcome-table.model";

type Outcome<TKeys extends string> = Record<TKeys, ChessOutcomeTable>;
type outcomes = Outcome<'won'|'lost'|'draw'>;

// TODO: This would represent the chess tables
export interface ChessTables {
    bullet: outcomes,
    blitz: outcomes,
    rapid: outcomes,
    daily: outcomes,
}