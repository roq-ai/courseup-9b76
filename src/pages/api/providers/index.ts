import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { providerValidationSchema } from 'validationSchema/providers';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getProviders();
    case 'POST':
      return createProvider();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getProviders() {
    const data = await prisma.provider
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'provider'));
    return res.status(200).json(data);
  }

  async function createProvider() {
    await providerValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.course?.length > 0) {
      const create_course = body.course;
      body.course = {
        create: create_course,
      };
    } else {
      delete body.course;
    }
    if (body?.health_coach?.length > 0) {
      const create_health_coach = body.health_coach;
      body.health_coach = {
        create: create_health_coach,
      };
    } else {
      delete body.health_coach;
    }
    const data = await prisma.provider.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
