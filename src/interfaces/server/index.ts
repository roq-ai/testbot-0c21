import { BotInterface } from 'interfaces/bot';
import { ChannelInterface } from 'interfaces/channel';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ServerInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  bot?: BotInterface[];
  channel?: ChannelInterface[];
  user?: UserInterface;
  _count?: {
    bot?: number;
    channel?: number;
  };
}

export interface ServerGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
