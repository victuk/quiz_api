const rolesAllowed = (roles) => {
    return (req, res, next) => {
        if(roles.includes(req.userDetails.role)) {
            next();
        } else {
            res.status(403).send({
                message: "Your role can't access this route"
            });
        }
    }
}

module.exports = rolesAllowed;
