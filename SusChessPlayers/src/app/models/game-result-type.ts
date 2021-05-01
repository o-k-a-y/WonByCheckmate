export const enum GameResultType
{
    WonByResignation = 'resigned',
    WonOnTime = 'timeout',
    WonByCheckmate = 'checkmated',
    WonByAbandonment = 'abandoned',
    DrawByAgreement = 'agreed',
    DrawByStalemate = 'stalemate',
    DrawByRepitition = 'repetition',
    DrawByInsufficientMaterial = 'insufficient',
    DrawByTimeoutVsInsufficientMaterial = 'timevsinsufficient',
    DrawBy50Move = '50move',
    LostByResignation = 'resigned',
    LostOnTime = 'timeout',
    LostByCheckmate = 'checkmated',
    LostByAbandonment = 'abandoned'
};