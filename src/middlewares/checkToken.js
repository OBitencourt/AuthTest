import jwt from 'jsonwebtoken'

export function checkToken (req, res, next) {

    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided or old method'})
    }

    const parts = authHeader.split(' ')

    if (parts.lenght === 2) {
        return res.status(401).json({ message: 'Token error'})
    }

    const [ scheme, token] = parts

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({message: "Token"})
    }

    try {
        const secret = process.env.SECRET

        jwt.verify(token, secret, (err) => {
            if (err) return res.status(401).json({ message: "Token invalid"})
        })

        next()

    } catch {

        return res.status(404).json({message: "Token inválido"})
    }

}