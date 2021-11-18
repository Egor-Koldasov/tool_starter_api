import dotenv from 'dotenv';
import path from 'path';

export const importEnv = (dirname: string, relPath: string) => dotenv.config({'path': path.resolve(dirname, relPath)});
