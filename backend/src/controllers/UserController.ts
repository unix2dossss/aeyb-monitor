import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import server from '..';
import { LoginRequest } from '../types/RequestTypes';
import User, { UserModel } from '../models/UserModel';
import jwt from 'jsonwebtoken';

/**
 * @desc    Login and gain an access token
 * @route   POST api/users/login
 */
const loginUser = asyncHandler(
    async (req: Request<undefined, undefined, LoginRequest>, res: Response) => {
        const credential = req.body.credential;

        if (typeof credential !== 'string') {
            res.status(400).json({
                message: `The credential must be a string (got ${typeof credential})`,
            });
            return;
        }

        try {
            const userId = await validateIdToken(credential, res);
            if (!userId) return;

            let user = await User.findById(userId);
            if (!user) {
                user = await User.create({ _id: userId, email: 'TODO' });
            }

            // The returned token can then be used to authenticate additional requests
            res.status(200).json({
                id: userId,
                token: generateJWT(userId),
                permissions: await getUserPermissions(user),
            });
        } catch (error) {
            res.status(400).json({
                message: 'Something went wrong while validating id token',
            });
        }
    },
);

// Reference: https://developers.google.com/identity/gsi/web/guides/verify-google-id-token

async function validateIdToken(
    credential: string,
    res: Response,
): Promise<string | undefined> {
    const ticket = await server.client.verifyIdToken({
        idToken: credential,
        audience: server.config.clientID,
    });

    const payload = ticket.getPayload();
    const userId = payload?.sub;
    if (!userId) {
        res.status(400).json({
            message: 'The id token provided was malformed',
        });
        return;
    }

    const domain = payload.hd;
    // When not in development, make sure users logging in have the correct email domain
    if (
        server.config.nodeEnv !== 'development' &&
        domain !== server.config.googleDomain
    ) {
        res.status(404).json({
            message: 'Invalid google domain',
        });
    }
    return userId;
}

function generateJWT(userId: string): string {
    return jwt.sign({ sub: userId }, server.config.jwtSecret, {
        expiresIn: '30d',
    });
}

// TODO: Fetch users permissions from database
// Maybe also move this to the permissions controller?
async function getUserPermissions(user: UserModel): Promise<Set<string>> {
    return new Set();
}

/**
 * @desc 	Get all the users
 * @route 	GET /api/users/
 */
const getUsers = asyncHandler(async (req: Request, res: Response) => {
    // Fetch users

    res.status(200).json({
        message: 'Nice work, you just made a GET request!',
    });
});

export { loginUser, getUsers, getUserPermissions };
