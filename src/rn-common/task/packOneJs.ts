import { buildJs } from "./comm";


const project = process.env.ENVPROJECT || ""

buildJs(project);



