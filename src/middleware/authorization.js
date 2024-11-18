const authorization = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return res.status(403).json({ error: "You Are Not Authorized" });
        }
        next();
    };
};

module.exports = authorization;
