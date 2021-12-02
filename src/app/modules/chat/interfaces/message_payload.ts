export interface VisitorSendMessagePayload {
  boothId: string;
  visitorId: string;
  comment: string;
  // logType: 'TEXT';
  // sendBy: 'VISITOR';
}

export interface VisitorExchangeBusinessCardPayload {
  boothId: string;
  visitorId: string;
  exhibitorId: string;
  exhibitorName: string;
  // logType: 'EXCHANGE_CARD_MESSAGE';
  // sendBy: 'VISITOR';
}

export interface ExhibitorSendMessagePayload {
  boothId: string;
  visitorId: string;
  exhibitorId: string;
  exhibitorName: string;
  comment: string;
  // logType: 'TEXT';
  // sendBy: 'EXHIBITOR';
}

export interface ExhibitorRequestChangeCardPayload {
  boothId: string;
  visitorId: string;
  exhibitorId: string;
  exhibitorName: string;
  // comment: string;
  // logType: 'REQUEST_CHANGE_CARD';
  // sendBy: 'EXHIBITOR';
}

export interface ExhibitorSendVideoCallUrlPayload {
  boothId: string;
  visitorId: string;
  exhibitorId: string;
  videoCallUrl: string;
  exhibitorName: string;
  // logType: 'TEXT';
  // sendBy: 'EXHIBITOR';
}

export interface VisitorAutoMessagePayload {
  boothId: string;
  visitorId: string;
  comment: string;
  // logType: 'EXCHANGE_CARD_MESSAGE';
  // sendBy: 'VISITOR';
}

export interface OperatorAutoMessagePayload {
  boothId: string;
  visitorId: string;
  exhibitorId?: string;
  comment: string;
  logType: 'TEXT' | 'GREETING_MESSAGE' | 'EXCHANGE_CARD_COMPLETE';
  sendBy: 'EXHIBITOR' | 'BOOTH';
}
