import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

const CLIENT_MUTATION_ID_EXPIRES_TIME = 5 * 60;
const VISITOR_VISIT_BOOTH_SOCKET_IDS_KEY = 'VISITOR_VISIT_BOOTH_SOCKET_IDS';
const LOGGED_IN_VISITOR_SOCKET_IDS_KEY = 'LOGGED_IN_VISITOR_SOCKET_IDS';
const BLOCK_ALERT_MAIL_VISITOR_CHAT_KEY = 'BLOCK_ALERT_MAIL_VISITOR_CHAT';

type ListVisitorSocket = {
  [socketId: string]: { visitorId: number; boothId: number }; // object containing the {key, value} pairs, with "key" is socketId
};

type ListSocketOfLoggedInVisitor = {
  [socketId: string]: number; // object containing the {key, value} pairs, with "key" is socketId and "value" is visitorId
};

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * @param key
   * @returns
   */
  get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  /**
   * @param key
   * @param value
   * @param expireTime set ttl, expire time unit is seconds, default if not set will disable expiration
   */
  async set<T>(key: string, value: T, expireTime?: number) {
    if (!expireTime) {
      await this.cacheManager.set(key, value);
    } else {
      await this.cacheManager.set(key, value, { ttl: expireTime });
    }
  }

  /**
   * @param key
   */
  del(key: string) {
    return this.cacheManager.del(key);
  }

  /**
   * @function reset reset redis store
   */
  reset() {
    return this.cacheManager.reset();
  }

  /**
   * @param clientMutationId
   * @param value
   */
  async setKeyClientMutationId(clientMutationId: string, value: any) {
    await this.cacheManager.set(
      `CLIENT_MUTATION_ID:${clientMutationId}`,
      value,
      { ttl: CLIENT_MUTATION_ID_EXPIRES_TIME },
    );
  }

  /**
   * @param clientMutationId
   * @returns
   */
  async getKeyClientMutationId<T>(
    clientMutationId: string,
  ): Promise<T | undefined> {
    return await this.cacheManager.get<T>(
      `CLIENT_MUTATION_ID:${clientMutationId}`,
    );
  }

  /**
   * @function reset reset redis store
   */
  resetCacheChatRealtime() {
    this.cacheManager.del(VISITOR_VISIT_BOOTH_SOCKET_IDS_KEY);
    this.cacheManager.del(LOGGED_IN_VISITOR_SOCKET_IDS_KEY);
  }

  /**
   * @param boothId
   * @returns array visitor ids standing inside booth
   */
  async getVisitorIdsInsideBooth(boothId: number): Promise<number[]> {
    const currentListSocketId: ListVisitorSocket =
      await this.cacheManager.get<ListVisitorSocket>(
        VISITOR_VISIT_BOOTH_SOCKET_IDS_KEY,
      );
    if (!currentListSocketId) return [];
    return [
      ...new Set(
        Object.values(currentListSocketId)
          .filter((ele) => ele.boothId === boothId)
          .map((ele) => ele.visitorId),
      ),
    ];
  }

  async storageVisitorSocketId(
    boothId: number,
    visitorId: number,
    socketId: string,
  ) {
    const currentListSocketId: ListVisitorSocket =
      await this.cacheManager.get<ListVisitorSocket>(
        VISITOR_VISIT_BOOTH_SOCKET_IDS_KEY,
      );
    const newListSocketId: ListVisitorSocket = !currentListSocketId
      ? {}
      : currentListSocketId;
    newListSocketId[`${socketId}`] = { visitorId, boothId };
    await this.cacheManager.set(
      VISITOR_VISIT_BOOTH_SOCKET_IDS_KEY,
      newListSocketId,
    );
  }

  async removeVisitorSocketId(socketId: string) {
    const listSocketId: ListVisitorSocket =
      await this.cacheManager.get<ListVisitorSocket>(
        VISITOR_VISIT_BOOTH_SOCKET_IDS_KEY,
      );
    if (listSocketId) {
      delete listSocketId[`${socketId}`];
      await this.cacheManager.set(
        VISITOR_VISIT_BOOTH_SOCKET_IDS_KEY,
        listSocketId,
      );
    }
  }

  async getInfoByVisitorSocketId(
    socketId: string,
  ): Promise<{ visitorId: number; boothId: number }> {
    const listSocketId: ListVisitorSocket =
      await this.cacheManager.get<ListVisitorSocket>(
        VISITOR_VISIT_BOOTH_SOCKET_IDS_KEY,
      );
    return !listSocketId ? null : listSocketId[`${socketId}`];
  }

  async countVisitorSocketIdInBooth(
    boothId: number,
    visitorId: number,
  ): Promise<number> {
    const listSocketId: ListVisitorSocket =
      await this.cacheManager.get<ListVisitorSocket>(
        VISITOR_VISIT_BOOTH_SOCKET_IDS_KEY,
      );
    if (!listSocketId) return 0;
    return Object.values(listSocketId).filter(
      (ele) => ele.visitorId === visitorId && ele.boothId === boothId,
    ).length;
  }

  async storageSocketIdOfOnlineVisitor(visitorId: number, socketId: string) {
    const currentListSocketId: ListSocketOfLoggedInVisitor =
      await this.cacheManager.get<ListSocketOfLoggedInVisitor>(
        LOGGED_IN_VISITOR_SOCKET_IDS_KEY,
      );
    const newListSocketId: ListSocketOfLoggedInVisitor = !currentListSocketId
      ? {}
      : currentListSocketId;
    newListSocketId[`${socketId}`] = visitorId;
    await this.cacheManager.set(
      LOGGED_IN_VISITOR_SOCKET_IDS_KEY,
      newListSocketId,
    );
  }

  async removeSocketIdOfVisitorInstance(socketId: string) {
    await this.removeVisitorSocketId(socketId);
    const listSocketId: ListSocketOfLoggedInVisitor =
      await this.cacheManager.get<ListSocketOfLoggedInVisitor>(
        LOGGED_IN_VISITOR_SOCKET_IDS_KEY,
      );
    if (listSocketId) {
      delete listSocketId[`${socketId}`];
      await this.cacheManager.set(
        LOGGED_IN_VISITOR_SOCKET_IDS_KEY,
        listSocketId,
      );
    }
  }

  // async getAllSocketIdsOfVisitor(visitorId: number) {
  //   const listSocketId: ListSocketOfLoggedInVisitor =
  //     await this.cacheManager.get<ListSocketOfLoggedInVisitor>(
  //       VISITOR_VISIT_BOOTH_SOCKET_IDS_KEY,
  //     );
  //   if (!listSocketId) return [];
  //   return Object.keys(listSocketId).filter(
  //     (ele) => listSocketId[ele] === visitorId,
  //   ).length;
  // }

  async getLoggedInVisitorIds(): Promise<number[]> {
    const currentListSocketId: ListSocketOfLoggedInVisitor =
      await this.cacheManager.get<ListSocketOfLoggedInVisitor>(
        LOGGED_IN_VISITOR_SOCKET_IDS_KEY,
      );
    if (!currentListSocketId) return [];
    return [...new Set(Object.values(currentListSocketId))];
  }

  setTimeBlockSendMailAlertVisitorChat(boothId: number, visitorId: number) {
    const key = `${BLOCK_ALERT_MAIL_VISITOR_CHAT_KEY}:${boothId}:${visitorId}`;
    this.cacheManager.set(key, { isBlock: true }, { ttl: 3 * 60 * 60 });
  }

  async checkBlockSendMailAlertVisitorChat(boothId: number, visitorId: number) {
    const key = `${BLOCK_ALERT_MAIL_VISITOR_CHAT_KEY}:${boothId}:${visitorId}`;
    const data = await this.cacheManager.get(key);
    return !data ? { isBlock: false } : { isBlock: true };
  }
}
