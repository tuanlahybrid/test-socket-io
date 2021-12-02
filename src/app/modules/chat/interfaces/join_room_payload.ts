export interface VisitorJoinBoothPayload {
  visitorId: string;
  boothId: string;
  isMessageBox: boolean;
}

export interface ExhibitorJoinChatroomPayload {
  visitorId: string;
  boothId: string;
  exhibitorId: string;
}
