const mapping: Record<string, string> = {
  bots: 'bot',
  channels: 'channel',
  servers: 'server',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
