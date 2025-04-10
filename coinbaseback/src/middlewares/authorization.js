export function authorization(...roles) {
    return (req, res, next) => {
        const { role } = req.user; 

        console.log("Rol del usuario:", role);

        if (!roles.includes(role)) {
            return res.status(403).json({
                error: "No tenés acceso a este recurso"
            });
        }

        next();
    };
}