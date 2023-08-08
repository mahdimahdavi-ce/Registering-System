
import { Request, Response } from 'express';
import { Roles } from './auth.roles.dto';

function authorization(roles: any = []) {
    if (typeof roles === 'number') {
        roles = [roles];
    }

    return (req: Request, res: Response, next: any) => {

        let role: any = Roles.Student
        //@ts-ignore
        switch (req.user.role) {
            case "ITManager":
                role = Roles.ITManager
                break
            case "EducationManager":
                role = Roles.EducationManager
                break
            case "Student":
                role = Roles.Student
                break
            case "Professor":
                role = Roles.Professor
                break
        }

        if (!roles.includes(role)) {
            res.status(401).json({ messsage: "Unauthorized" })
        }else {
            next()
        }
       
    }
}

export { authorization }