import vine, { errors } from "@vinejs/vine";
import { newsSchema } from "../validations/newsValidation.js";
import { generateRandomNumber, imageValidator } from "../utils/helper.js";
import prisma from "../db/db.config.js";
import NewsApiTransform from "../transform/newsApiTransform.js";

class NewsController {
    static async index(req, res) {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit) || 1;

        if (page <= 0) {
            page = 1;

        }
        if (limit <= 0 || limit >= 100) {
            limit = 10;
        }

        const skip = (page - 1) * limit;

        const news = await prisma.news.findMany({
            take: limit,
            skip: skip,
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
        const totalNews = await prisma.news.count();
        const total = Math.ceil(totalNews / limit);
        return res.status(200).json({
            status: 200, news: newsTransform, metaData: {
                total,
                page,
                limit
            }
        });
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
        const { id } = req.params;
        try {
            const news = await prisma.news.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profile: true
                        }
                    }
                }
            });
            if (!news) {
                return res.status(404).json({ status: 404, message: "News not found" });
            }
            return res.status(200).json({ status: 200, news: NewsApiTransform.transform(news) });
        } catch (error) {
            return res.status(500).json({ status: 500, message: "Something went wrong.Please try again" });

        }

    }

    static async update(req, res) {
        const { id } = req.params;
        const user = req.user;
        const body = req.body;
        try {
            const news = await prisma.news.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!news) {
                return res.status(404).json({ status: 404, message: "News not found" });
            }
            if (news.user_id !== user.id) {
                return res.status(403).json({ status: 403, message: "You are not allowed to update this news" });
            }
            const updatedNews = await prisma.news.update({
                where: {
                    id: Number(id)
                },
                data: body
            });
            return res.status(200).json({ status: 200, message: "News updated successfully", news: updatedNews });
        } catch (error) {
            return res.status(500).json({ status: 500, message: "Something went wrong.Please try again" });
        }

    }
    static async destory(req, res) {
        const { id } = req.params;
        const user = req.user;
        try {
            const news = await prisma.news.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!news) {
                return res.status(404).json({ status: 404, message: "News not found" });
            }
            if (news.user_id !== user.id) {
                return res.status(403).json({ status: 403, message: "You are not allowed to delete this news" });
            }
            await prisma.news.delete({
                where: {
                    id: Number(id)
                }
            });
            return res.status(200).json({ status: 200, message: "News deleted successfully" });
        } catch (error) {
            return res.status(500).json({ status: 500, message: "Something went wrong.Please try again" });
        }
    }
}


export default NewsController