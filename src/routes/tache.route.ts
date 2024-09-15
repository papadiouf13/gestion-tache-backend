import {Router} from "express"
import { validatorSchema} from "../middlewares/validator/validator.middleware";
import { TacheController } from "../controllers/tache.controller";


const routerTache = Router();
const tacheController = new TacheController();

routerTache.post("/:id", tacheController.update)
routerTache.delete("/:id", tacheController.delete)
routerTache.get("/", tacheController.show)
routerTache.get("/:userId", tacheController.getTachesByUserId)
routerTache.post("/",[validatorSchema()], tacheController.store)
routerTache.patch("/:id", tacheController.complete)
routerTache.patch("/incomplete/:id", tacheController.incomplete)

export default routerTache;