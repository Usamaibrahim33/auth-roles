const { PrismaClientKnownRequestError } = require("@prisma/client")
const { 
   createPostDb,
   deletePostDb 
  } = require('../domains/post.js')
const prisma = require("../utils/prisma.js")

const createPost = async (req, res) => {
  const userId = req.user.id
  console.log(req.user)
  const {
    title,
  } = req.body

  if (!title || !userId) {
    return res.status(400).json({
      error: "Missing fields in request body"
    })
  }

  try {
    const createdPost = await createPostDb(title, userId)

    return res.status(201).json({ post: createdPost })
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res.status(409).json({ error: "A user with the provided ID does not exist" })
      }
    }

    res.status(500).json({ error: e.message })
  }
}

const deletePost = async (req, res) => {
  try {
    console.log('this is the controller');
    const id = Number(req.params.id);
    console.log(id);
    const deletedPost = await deletePostDb(id);

    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    console.log(deletedPost);
    return res.status(200).json({ post: deletedPost });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error, try again later!' });
  }
};







module.exports = {
  createPost,
  deletePost,
}
