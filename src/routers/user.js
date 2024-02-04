const express = require("express");
const {
  createUser, 
  loginUser,
  getAllUsers,
  deleteUserById,
} = require('../controllers/user');

const { 
  verifyToken, 
  verifyAdminRole,
} = require("../middleware/userAuth");

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.get("/", verifyToken,verifyAdminRole, getAllUsers);
router.delete("/:id", verifyToken, verifyAdminRole, deleteUserById)





module.exports = router;
