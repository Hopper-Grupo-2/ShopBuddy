import jwtLib from "jsonwebtoken";
import IUser from "../../server/src/interfaces/user";
import dotenv from "dotenv";
dotenv.config();

export function generateCookieForUser(user: IUser) {
    // use jwt library to make a jwt with payload {id: user_id}
    const jwtToken = jwtLib.sign(user, process.env.JWTSECRET || "my secret");
    // return token will be used cookie
    return jwtToken;
}

/*ex.:
user = {
    _id: decoded._id,
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    createdAt: Date,
    updatedAt: Date,
}
*/
