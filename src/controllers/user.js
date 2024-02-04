const { PrismaClientKnownRequestError } = require("@prisma/client")
const { createUserDb, getUserByUsernameDb, getAllUsersDb, deleteUserByIdDb } = require('../domains/user.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const createUser = async (req, res) => {
  const {
    username,
    password,
    role = 'USER',
  } = req.body

  if (!username || !password) {
    return res.status(400).json({
      error: "Missing fields in request body"
    })
  }

  try {
    const createdUser = await createUserDb(username, password, role)

    return res.status(201).json({ user: createdUser })
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res.status(409).json({ error: "A user with the provided username already exists" })
      }
    }

    res.status(500).json({ error: e.message })
  }
}


const loginUser = async (req, res) => {
    const {username, password} = req.body;

    const user = await getUserByUsernameDb(username)
    if(!user) {
        return res.status(404).json({error: "user with that credential does'nt exist"})
    };

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)

    if(!isPasswordCorrect) {
        return res.status(404).json({error: "user with that credential does'nt exist"})
    }

    const token = await jwt.sign(username, secretKey);
    return res.status(200).json({"token": token})

}


const getAllUsers = async (req, res) => {
  const users = await getAllUsersDb()
  return res.status(200).json({users: users})
}



// const deleteUserById = async (req, res) => {

const deleteUserById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    
    console.log(id)
    const deletedUser = await deleteUserByIdDb(id);

    return res.status(200).json({ user: deletedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  deleteUserById,
}
