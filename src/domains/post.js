const prisma = require('../utils/prisma')


const createPostDb = async (title, userId) => await prisma.post.create({
  data: {
    title,
    user: {
      connect: {
        id: userId
      }
    }
  }
})


const deletePostDb = async (id) => {
  console.log('this is the domain')
  return await prisma.post.delete({
    where: {id}
  })
}


const getPostByIdDb = async (postId) => {
  return prisma.post.findUnique({
    where: {
      id: postId
    },
    include: {
      user: true // Include the associated user
    }
  });
}




module.exports = {
  createPostDb,
  deletePostDb,
  getPostByIdDb,
}
