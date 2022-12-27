import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function editReview(req: NextApiRequest, res: NextApiResponse,) {

    await prisma.review.update({
        where: {
            reviewId : req.body.reviewId,
        },
        data : req.body
    })
    res.status(200);
}
