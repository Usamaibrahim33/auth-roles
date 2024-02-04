

const jwt = require('jsonwebtoken');
const { getUserByUsernameDb } = require('../domains/user');
const { getPostByIdDb } = require('../domains/post');
const secretKey = process.env.JWT_SECRET;

const verifyToken = async  (req, res, next) => {
    const authToken = req.headers.authorization;

    if(!authToken) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    const [_, token] = authToken.split(" ");

    if(!token) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
    };

    try {
        const isTokenVerified = await jwt.verify(token, secretKey);
        if(!isTokenVerified) {
            return res.status(401).json({ error: 'Unauthorized: Token is not correct' });
        }

        const foundUser = await getUserByUsernameDb(isTokenVerified);

        if(!foundUser) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        delete foundUser.passwordHash;
        req.user = foundUser
        next()

    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};



const verifyAdminRole = async (req, res, next) => {

    if(req.pass) {
        next()
        return
    }

    const id = Number(req.params.id)
    if(!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // if user wats to delete there selfs and if user is admin they are  free to pass
    if(req.user.id === id || req.user.role === 'ADMIN') {
        next()
        return
    }

    return res.status(403).json({error: "your not authorize to view this content!"})

};



const verifyIfUserPost = async (req, res, next) => {
    const id = Number(req.params.id);
    const postToDelete = await getPostByIdDb(id);
    console.log('this is it', postToDelete)

    if(req.user.role === 'ADMIN' || req.user.id === postToDelete.userId) {
        req.pass = true;
        return next();
    }

    return res.status(403).json({error: "your not authorize to view this content!"})
}




module.exports = {
    verifyAdminRole,
    verifyToken,
    verifyIfUserPost
}
