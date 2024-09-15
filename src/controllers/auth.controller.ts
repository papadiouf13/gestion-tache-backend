import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JSECRET_ACCESS_TOKEN!;
const JWT_EXPIRATION = process.env.JSECRET_TIME_TO_EXPIRE!;

export class AuthController {
  async register(req: Request, res: Response) {
    const { username, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
    } catch (error) {
      console.error('Erreur lors de l\'inscription de l\'utilisateur:', error);
      res.status(500).json({ message: 'Erreur lors de l\'inscription de l\'utilisateur' });
    }
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body;
  
    try {
      const user = await prisma.user.findUnique({
        where: { username },
      });
  
      if (!user) {
        return res.status(401).json({ message: 'Nom d\'utilisateur incorrect' });
      }
  
      if (!user.password) {
        return res.status(401).json({ message: 'Aucun mot de passe défini pour cet utilisateur' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Mot de passe incorrect' });
      }
  
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
      });
  
      res.status(200).json({ message: 'Connexion réussie', token });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
  }
  
}
