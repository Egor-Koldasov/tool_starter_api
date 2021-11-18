import { importEnv } from "../../database/env/setup-env";

const testEnv = importEnv(__dirname, '../../../test.env');
const devEnv = importEnv(__dirname, '../../../dev.env');