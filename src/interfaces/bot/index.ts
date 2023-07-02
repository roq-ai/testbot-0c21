import { ServerInterface } from 'interfaces/server';
import { GetQueryInterface } from 'interfaces';

export interface BotInterface {
  id?: string;
  nickname: string;
  server_id?: string;
  created_at?: any;
  updated_at?: any;

  server?: ServerInterface;
  _count?: {};
}

export interface BotGetQueryInterface extends GetQueryInterface {
  id?: string;
  nickname?: string;
  server_id?: string;
}
