import prisma from "../DB/db.config.js";
import vine, { errors } from "@vinejs/vine";
import { registerSchema, loginSchema } from "../validations/authValidation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../config/mailer.js";

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

    static async login(req, res) {
        try {
            const body = req.body;
            const validator = vine.compile(loginSchema);
            const payload = await validator.validate(body);

            const findUser = await prisma.users.findUnique({
                where: {
                    email: payload.email,
                },
            });

            if (!findUser) {
                return res.status(400).json({ message: "User not found" });
            }

            const isMatch = bcrypt.compareSync(payload.password, findUser.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const payloadData = {
                id: findUser.id,
                email: findUser.email,
                name: findUser.name,
                profile: findUser.profile
            }

            const token = jwt.sign(payloadData, process.env.JWT_SECRET, {
                expiresIn: "10d",
            })



            return res.status(200).json({ message: "User logged in successfully", user: findUser, accessToken: `Bearer ${token}` });


        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ errors: error.messages });
            } else {
                return res.status(500).json({
                    status: 500,
                    message: "Something went wrong.Please try again."

                });
            }
        }

    }

    static async sendTestMail(req, res) {
        try {
            const { email } = req.query;
            const payload = {
                toEmail: email,
                subject: "Test Mail",
                body: "<h1>This is a test mail</h1>",
            }
            await sendMail(payload.toEmail, payload.subject, payload.body);
            return res.status(200).json({
                status: 200,
                message: "Mail sent successfully",
            })
        } catch (error) {
            console.log("The error is", error);
            return res.status(500).json({
                status: 500,
                message: "Something went wrong.Please try again."
            });
        }
    }
}

export default AuthController;
