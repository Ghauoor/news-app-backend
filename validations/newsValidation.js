import vine from "@vinejs/vine";
import { CustomErrorReporter } from "./CustomErrorReporter.js";


vine.errorReporter = () => new CustomErrorReporter();

export const newsSchema = vine.object({
    title: vine.string().minLength(5).maxLength(100),
    content: vine.string().minLength(15).maxLength(30000),
}) 