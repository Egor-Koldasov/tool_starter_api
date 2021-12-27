import { Request } from "express";
import config from "../config";
import colors from 'colors/safe';
import dayjs from "dayjs";

export enum LogLvl {
  SILENT = 1,
  CRITICAL,
  ERROR,
  WARNING,
  INFO,
  DEBUG,
  V,
  VV,
  VVV
}
export const log = (args: any[], lvl: LogLvl) => {
  colors.enable();
  const logLvlName = config.logLvl as (keyof typeof LogLvl)
  const enabledLvl = LogLvl[logLvlName] || LogLvl.INFO;
  if (lvl > enabledLvl) return;
  const date = dayjs().format('YYYY-MM-DD/HH:mm:ss');
  const hostname = process.env.HOSTNAME || '';
  console.log(
    colors.bgWhite(colors.black(date)),
    hostname,
    '\n',
    ...args
  );
}
export const debug = (...args: any[]) => log([colors.green('debug'), ...args], LogLvl.DEBUG);
export const info = (...args: any[]) => log([colors.blue('info'), ...args], LogLvl.INFO);
export const error = (...args: any[]) => log([colors.red('error'), ...args], LogLvl.ERROR);
export const logError = error;

export const logRequest = (routePath: string, req: Request) => debug(`[Req] ${routePath} ${req.method}`);
