import { buildJs } from "./comm";
import { packAndroid } from "./packAndroid";


const project = process.env.ENVPROJECT || ""

packAndroid(project, true);



