import prisma from "../db/db.config.js";
import { generateRandomNumber, imageValidator } from "../utils/helper.js";

class ProfileController {
    static async index(req, res) {
        try {
            const user = req.user;
            return res.status(200).json({ status: 200, data: user });
        } catch (error) {
            return res.status(500).json({ status: 500, error: error.message });
        }
    }

    static async store() { }
    static async show() { }
    static async update(req, res) {
        const { id } = req.params;
        try {
            const authUser = req.user;

            if (authUser.id != id) {
                return res
                    .status(401)
                    .json({ status: 401, error: "Unauthorized" })
            }

            if (!req.files || Object.keys(req.files).length === 0) {
                return res
                    .status(400)
                    .json({ status: 400, error: 'File is required' });
            }


            const profile = req.files.profile;

            const message = imageValidator(profile?.size, profile?.mimetype);

            if (message !== null) {
                return res
                    .status(400)
                    .json({ status: 400, error: message });
            }


            const imageExt = profile?.name.split('.');
            const imageName = generateRandomNumber() + '.' + imageExt[imageExt.length - 1];

            const uploadPath = process.cwd() + '/public/images/' + imageName;

            profile.mv(uploadPath, function (error) {
                if (error) {
                    return res
                        .status(500)
                        .json({ status: 500, error: error });
                }
            });

            await prisma.users.update({
                data: {
                    profile: imageName
                },
                where: {
                    id: Number(id)
                }
            })

            return res.
                status(200)
                .json({
                    status: 200,
                    message: "Profile updated successfully"
                });

        } catch (error) {
            return res
                .status(500)
                .json({ status: 500, error: error.message });

        }
    }
    static async destroy() { }



}


export default ProfileController;