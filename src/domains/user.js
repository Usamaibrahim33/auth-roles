const prisma = require('../utils/prisma')
const bcrypt = require('bcrypt')

const createUserDb = async (username, password, role = 'USER') => await prisma.user.create({
  data: {
    username,
    passwordHash: await bcrypt.hash(password, 6),
    role
  }
})


const getUserByUsernameDb = async (userName) => {
  return await prisma.user.findUnique({
    where: {
      username: userName
    }
  });
};



const getAllUsersDb = async () => {
  return await prisma.user.findMany({})
}



const deleteUserByIdDb = async (userId) => {
  // Delete associated posts
  await prisma.post.deleteMany({
    where: {
      userId: userId,
    },
  });

  // Delete the user
  return await prisma.user.delete({
    where: {
      id: userId,
    },
  });
};








module.exports = {
  createUserDb,
  getUserByUsernameDb,
  getAllUsersDb,
  deleteUserByIdDb,
}
