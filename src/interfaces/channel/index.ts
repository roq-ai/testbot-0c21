import { ServerInterface } from 'interfaces/server';
import { GetQueryInterface } from 'interfaces';

export interface ChannelInterface {
  id?: string;
  name: string;
  type: string;
  server_id?: string;
  created_at?: any;
  updated_at?: any;

  server?: ServerInterface;
  _count?: {};
}

export interface ChannelGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  type?: string;
  server_id?: string;
}
