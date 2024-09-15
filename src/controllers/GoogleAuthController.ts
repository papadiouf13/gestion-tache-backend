import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.CLIENT_ID);
const JWT_SECRET = process.env.JSECRET_ACCESS_TOKEN!;
const JWT_EXPIRATION = process.env.JSECRET_TIME_TO_EXPIRE!;

export class GoogleAuthController {
  async loginWithGoogle(req: Request, res: Response) {
    const { token } = req.body;

    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const googleUserId = payload?.sub;
      const email = payload?.email;

      if (!googleUserId || !email) {
        return res.status(400).json({ message: 'Invalid Google token' });
      }

      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            username: email,
            googleId: googleUserId,
            email: email,
            password: null,  
          },
        });
      }

      const jwtToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
      });

      res.status(200).json({ message: 'Connexion réussie avec Google', token: jwtToken });
    } catch (error) {
      console.error('Erreur lors de la connexion avec Google:', error);
      res.status(500).json({ message: 'Erreur lors de la connexion avec Google' });
    }
  }
}
