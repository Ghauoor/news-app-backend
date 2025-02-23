import vine, { errors } from "@vinejs/vine";
import { newsSchema } from "../validations/newsValidation.js";
import { generateRandomNumber, imageValidator } from "../utils/helper.js";
import prisma from "../db/db.config.js";
import NewsApiTransform from "../transform/newsApiTransform.js";

class NewsController {
    static async index(req, res) {
        const news = await prisma.news.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profile: true,
                    }
                }
            }
        });
        const newsTransform = news?.map((item) => NewsApiTransform.transform(item)) // shouldn't be used
        return res.status(200).json({ status: 200, news: newsTransform });
    }

    static async store(req, res) {
        try {
            const user = req.user;
            const body = req.body;
            const validator = vine.compile(newsSchema);
            const payload = await validator.validate(body);
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ errors: "Image Field is Required" });
            }
            const image = req.files.image;
            const message = imageValidator(image?.size, image?.mimetype);

            if (message !== null) {
                return res
                    .status(400)
                    .json({ status: 400, error: message });
            }

            const imageExt = image?.name.split('.');
            const imageName = generateRandomNumber() + '.' + imageExt[imageExt.length - 1];

            const uploadPath = process.cwd() + '/public/images/' + imageName;

            image.mv(uploadPath, function (error) {
                if (error) {
                    return res
                        .status(500)
                        .json({ status: 500, error: error });
                }
            });

            payload.image = imageName;
            payload.user_id = user.id;
            console.log("Payload", payload);
            const news = await prisma.news.create({
                data: payload
            })
            return res.json({ message: "News created successfully", payload: news });
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

    static async show(req, res) {

    }
    static async update(req, res) {

    }
    static async destory(req, res) {

    }
}


export default NewsController