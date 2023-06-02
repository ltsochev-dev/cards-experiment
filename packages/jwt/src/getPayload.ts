import jwt from 'jsonwebtoken'

const secret = 'adasdasd'

const getPayload = <T>(token: string): T => jwt.verify(token, secret) as T

export default getPayload