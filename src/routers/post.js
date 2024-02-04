const express = require("express");

const {
  createPost, 
  deletePost
} = require('../controllers/post');

const { 
  verifyToken, 
  verifyAdminRole,
  verifyIfUserPost, 
 } = require("../middleware/userAuth");

const router = express.Router();

router.post("/", verifyToken, createPost);
router.delete("/:id", verifyToken, verifyIfUserPost, verifyAdminRole, deletePost)

module.exports = router;
