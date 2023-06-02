import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

const secret = 'adasdasd'

interface Props {
    avatar?: string
    locale?: string
    username: string
}

const generateToken = ({ avatar, username, locale = 'en' }: Props) => {

    const payload = {
        sub: uuidv4(),
        name: username,
        locale, // @todo - validate whether locale is a valid locale. Maybe use zod here? 
        avatar: avatar ?? `https://api.multiavatar.com/${encodeURIComponent(username)}.png`
    }


    const token = jwt.sign(payload, secret, { expiresIn: '1w' })

    return token
}

export default generateToken