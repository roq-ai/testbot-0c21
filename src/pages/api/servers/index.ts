import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { serverValidationSchema } from 'validationSchema/servers';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getServers();
    case 'POST':
      return createServer();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getServers() {
    const data = await prisma.server
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'server'));
    return res.status(200).json(data);
  }

  async function createServer() {
    await serverValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.bot?.length > 0) {
      const create_bot = body.bot;
      body.bot = {
        create: create_bot,
      };
    } else {
      delete body.bot;
    }
    if (body?.channel?.length > 0) {
      const create_channel = body.channel;
      body.channel = {
        create: create_channel,
      };
    } else {
      delete body.channel;
    }
    const data = await prisma.server.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
