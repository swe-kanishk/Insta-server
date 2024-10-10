import jwt from "jsonwebtoken";

const isAuthenticated = async(req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization;
        if(!token) {
            return res.status(401).json({
                message: 'User not authenticated!',
                success: false
            });
        }
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY);
        if(!verifiedUser){
            return res.status(401).json({
                message: 'Invalid',
                success: false
            });
        }
        req.id = verifiedUser.userId;
        next();
    } catch (err) {
        console.log(err)
        return res.status(401).json({message: err.message, success: false})
    }
}

export default isAuthenticated;