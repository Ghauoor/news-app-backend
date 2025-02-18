import { supportedFiles } from "../config/filesystem.js";
import { v4 as uuidv4 } from 'uuid';


export const imageValidator = (size, mime) => {

    if (bytesToMb(size) > 2) {
        return 'File size should not exceed 2MB';
    } else if (!supportedFiles.includes(mime)) {
        return 'File type not supported';
    }

    return null;
}

export const bytesToMb = (bytes) => {
    return bytes / (1024 * 1024);
}

export const generateRandomNumber = () => {
    return uuidv4();
}