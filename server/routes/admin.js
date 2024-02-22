import express from 'express'
import { 
    createMessage, 
    getAllAnnouncements, 
    getAllEmployee, 
    getAllMessages, 
    getAllOrders, 
    getAllProducts, 
    getAllUsers, 
    getDashboardContents, 
    makeAnnouncement 
} from '../controllers/admin.js';

const router = express.Router();

router.get("/getAllUsers", getAllUsers);
router.get("/getAllEmployee", getAllEmployee);
router.get("/getAllProducts", getAllProducts);
router.get("/getAllOrders", getAllOrders);
router.get("/getAllMessages", getAllMessages);
router.post("/createMessage", createMessage);
router.post("/makeAnnouncement", makeAnnouncement);
router.get("/getAllAnnouncements", getAllAnnouncements);
router.get("/getDashboardContents", getDashboardContents)

export default router;