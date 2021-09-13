export interface Results {
  wonByResignation: number,
  wonByTimeout: number,
  wonByCheckmate: number,
  wonByAbandonment: number,
  drawByAgreement: number,
  drawByStalemate: number,
  drawByRepetition: number,
  drawByInsufficientMaterial: number,
  drawByTimeoutVsInsufficientMaterial: number,
  drawBy50Move: number,
  lostByResignation: number,
  lostByTimeout: number,
  lostByCheckmate: number,
  lostByAbandonment: number
}