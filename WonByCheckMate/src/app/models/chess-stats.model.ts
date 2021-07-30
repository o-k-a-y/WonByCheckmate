import { Results } from "./results.model";

// Each of these is a type where each key (they are separated by |) are mapped to Results interface
type TimeControl<TKeys extends string | number> = Record<TKeys, Results>;
export type BulletStats = TimeControl<'30' | '60' | '60+1' | '120+1'>;
export type BlitzStats = TimeControl<'180' | '300' | '480'>;
export type RapidStats = TimeControl<'600' | '900' | '1200' | '1800' | '3600'>;
export type DailyStats = TimeControl<'86400/1' | '1/172800' | '1/259200' | '1/432000' | '1/604800' | '1/1209600'>;

export interface ChessStats {
  bullet: BulletStats,
  blitz: BlitzStats,
  rapid: RapidStats,
  daily: DailyStats
}