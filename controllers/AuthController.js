import prisma from "../db/db.config.js";
import vine, { errors } from "@vinejs/vine";
import { registerSchema } from "../validations/authValidation.js";
import bcrypt from "bcryptjs";

class AuthController {
    static async register(req, res) {
        try {
            const body = req.body;
            const validator = vine.compile(registerSchema);
            const payload = await validator.validate(body);
            const findUser = await prisma.users.findUnique({
                where: {
                    email: payload.email,
                },
            })

            if (findUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            const salt = bcrypt.genSaltSync(10);

            payload.password = bcrypt.hashSync(payload.password, salt);
            const user = await prisma.users.create({
                data: payload,
            })
            return res.status(201).json({ message: "User registered successfully", user });
        } catch (error) {
            console.log("The error is", error);
            if (error instanceof errors.E_VALIDATION_ERROR) {
                // console.log(error.messages);
                return res.status(400).json({ errors: error.messages });
            } else {
                return res.status(500).json({
                    status: 500,
                    message: "Something went wrong.Please try again.",
                });
            }
        }
    }
}

export default AuthController;
