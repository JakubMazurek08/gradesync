import {dbClient} from "../config/database";
import {JwtPayload} from "jsonwebtoken";

export const isTeacher = async (userId: string | JwtPayload | undefined ) => {
    const result = await dbClient.query(`
    SELECT t.id
    FROM teachers t
    JOIN users u ON t.user_id = u.id
    WHERE u.id = $1
  `, [userId]);


    if(result.rows[0]){
        return true;
    }
    return false;
};