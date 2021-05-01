namespace API.Models {
    public static class GameResult {
        public const string DrawByAgreement = "agreed";
        public const string DrawByStalemate = "stalemate";
        public const string DrawByRepitition = "repetition";
        public const string DrawByInsufficientMaterial = "insufficient";
        public const string DrawByTimeoutVsInsufficientMaterial = "timevsinsufficient";
        public const string DrawBy50Move = "50move";
        public const string Resigned = "resigned";
        public const string CheckMated = "checkmated";
        public const string Win = "win";
        public const string Abandonded = "abandoned";
        public const string Timeout = "timeout";
    }
}