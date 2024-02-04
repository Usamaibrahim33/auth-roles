const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');


// creating of  the seed!
async function seed() {
  const users = []

  while (users.length < 10) {
    const user = await createUser(faker.internet.userName(), '123456789')
    users.push(user)
  }



  const adminUser = await createUser(faker.internet.userName(), 'admin', role = "ADMIN")

  process.exit(0)
}



// this is the creating of new user fucntion
async function createUser(username, password, role = 'USER') {
  const posts = []

  for (let i = 0; i < username.length; i++) {
    posts.push({ title: faker.lorem.sentence() })
  }

  const user = await prisma.user.create({
    data: {
      username,
      passwordHash: await bcrypt.hash(password, 6),
      role: role,
      posts: {
        create: posts
      }
    },
    include: {
      posts: true
    }
  })

  console.log('User created', user);

  return user;
}

seed()
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
  })
  .finally(() => process.exit(1));
