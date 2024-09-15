import { Request, Response } from "express";
import Controller from "../core/impl/controller";
import prisma from "../core/impl/prisma.model";
import RestResponse from "../core/response";
import { StatusCodes } from "http-status-codes";

export class TacheController extends Controller {
  async store(req: Request, res: Response) {
    try {
      const { libelle, statut, userId, etat } = req.body;

      const newTache = await prisma.tache.create({
        data: {
          libelle,
          statut,
          etat,
          userId,
        },
      });

      res.status(StatusCodes.OK).send(RestResponse.response(newTache, StatusCodes.OK));
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).send(
        RestResponse.response("Erreur lors de la création de la tâche", StatusCodes.BAD_REQUEST)
      );
    }
  }

  async show(req: Request, res: Response) {
    try {
      const taches = await prisma.tache.findMany({
        where: {
          etat: true, // Afficher uniquement les tâches dont l'état est à true
        },
        select: {
          id: true,
          libelle: true,
          statut: true,
          etat: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      });
  
      res.status(StatusCodes.OK).send(RestResponse.response(taches, StatusCodes.OK));
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).send(
        RestResponse.response("Tâches non trouvées", StatusCodes.NOT_FOUND)
      );
    }
  }
  

  async update(req: Request, res: Response) {
    try {
      const tacheId = parseInt(req.params.id);
      const { libelle, statut, etat, userId } = req.body;

      const tache = await prisma.tache.findUniqueOrThrow({
        where: { id: tacheId },
      });

      const updatedTache = await prisma.tache.update({
        where: { id: tacheId },
        data: {
          libelle: libelle ?? tache.libelle,
          statut: statut ?? tache.statut,
          etat: etat ?? tache.etat,
          userId: userId ?? tache.userId,
        },
      });

      res.status(StatusCodes.OK).send(RestResponse.response(updatedTache, StatusCodes.OK));
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).send(
        RestResponse.response("Tâche non trouvée ou erreur lors de la mise à jour", StatusCodes.NOT_FOUND)
      );
    }
  }

async getTachesByUserId(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);

      if (isNaN(userId)) {
        return res.status(StatusCodes.BAD_REQUEST).send(
          RestResponse.response("Invalid user ID", StatusCodes.BAD_REQUEST)
        );
      }

      const taches = await prisma.tache.findMany({
        where: { userId },
        select: {
          id: true,
          libelle: true,
          statut: true,
          etat: true,
          createdAt: true,
          updatedAt: true,
          user: { 
            select: {
              username: true,
            }
          }
        },
      });

      if (taches.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).send(
          RestResponse.response("Aucune tâche trouvée pour cet utilisateur", StatusCodes.NOT_FOUND)
        );
      }

      const tachesWithUsername = taches.map(tache => ({
        ...tache,
        username: tache.user.username
      }));

      res.status(StatusCodes.OK).send(RestResponse.response(tachesWithUsername, StatusCodes.OK));
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
        RestResponse.response("Erreur lors de la récupération des tâches", StatusCodes.INTERNAL_SERVER_ERROR)
      );
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const tacheId = parseInt(req.params.id);
  
      // Vérifier si la tâche existe
      const tache = await prisma.tache.findUnique({
        where: { id: tacheId },
      });
  
      if (!tache) {
        return res.status(StatusCodes.NOT_FOUND).send(
          RestResponse.response("Tâche non trouvée", StatusCodes.NOT_FOUND)
        );
      }
  
      const deletedTache = await prisma.tache.update({
        where: { id: tacheId },
        data: {
          etat: false,  
        },
      });
  
      res.status(StatusCodes.OK).send(RestResponse.response(deletedTache, StatusCodes.OK));
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
        RestResponse.response("Erreur lors de la suppression de la tâche", StatusCodes.INTERNAL_SERVER_ERROR)
      );
    }
  }

  async complete(req: Request, res: Response) {
    try {
      const tacheId = parseInt(req.params.id);

      // Vérifier si la tâche existe
      const tache = await prisma.tache.findUnique({
        where: { id: tacheId },
      });

      if (!tache) {
        return res.status(StatusCodes.NOT_FOUND).send(
          RestResponse.response("Tâche non trouvée", StatusCodes.NOT_FOUND)
        );
      }

      // Mettre à jour la tâche pour que son statut soit marqué comme "complete"
      const updatedTache = await prisma.tache.update({
        where: { id: tacheId },
        data: {
          statut: "complete",
        },
      });

      res.status(StatusCodes.OK).send(RestResponse.response(updatedTache, StatusCodes.OK));
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
        RestResponse.response("Erreur lors de la mise à jour du statut de la tâche", StatusCodes.INTERNAL_SERVER_ERROR)
      );
    }
  }
  
  async incomplete(req: Request, res: Response) {
    try {
      const tacheId = parseInt(req.params.id);

      const tache = await prisma.tache.findUnique({
        where: { id: tacheId },
      });

      if (!tache) {
        return res.status(StatusCodes.NOT_FOUND).send(
          RestResponse.response("Tâche non trouvée", StatusCodes.NOT_FOUND)
        );
      }

      const updatedTache = await prisma.tache.update({
        where: { id: tacheId },
        data: {
          statut: "incomplete",
        },
      });

      res.status(StatusCodes.OK).send(RestResponse.response(updatedTache, StatusCodes.OK));
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
        RestResponse.response("Erreur lors de la mise à jour du statut de la tâche", StatusCodes.INTERNAL_SERVER_ERROR)
      );
    }
  }
  
}
