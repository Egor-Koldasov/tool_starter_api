import { importEnv } from "../../env/importEnv";

const testEnv = importEnv(__dirname, '../../../test.env');
const devEnv = importEnv(__dirname, '../../../dev.env');