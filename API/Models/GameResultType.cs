namespace API.Models {
    public enum GameResultType {
        WonByResignation = 0,
        WonOnTime,
        WonByCheckmate,
        WonByAbandonment,
        WonByKingOfTheHill,
        WonByThreeCheck,
        WonByBugHouse,
        DrawByAgreement,
        DrawByStalemate,
        DrawByRepitition,
        DrawByInsufficientMaterial,
        DrawByTimeoutVsInsufficientMaterial,
        DrawBy50Move,
        LostByResignation,
        LostOnTime,
        LostByCheckmate,
        LostByAbandonment,
        LostByThreeCheck,
        LostByKingOfTheHill,
        LostByBugHousePartnerLose
    };
}