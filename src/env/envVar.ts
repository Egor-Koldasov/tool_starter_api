
export const requireVar = (name: string): string => {
  const env = process.env[name];
  if (env === undefined) throw new Error(`Environment variable "${name}" is not set`);
  return env;
}
export const stringVar = (name: string, defaultVal?: string): string => {
  if (defaultVal === undefined) {
    return requireVar(name);
  }
  const env = process.env[name];
  return env !== undefined ? env : defaultVal;
}

const stringVarToNumber = <DefaultVal>(envVar: string, defaultVal: DefaultVal): number | DefaultVal => {
  const falseNumber = parseInt(envVar);
  if (!isFinite(falseNumber)) {
    return defaultVal
  };
  return falseNumber;
}

export const numberVar = (name: string, defaultVal?: number): number => {
  if (defaultVal === undefined) {
    const number = stringVarToNumber(requireVar(name), undefined);
    if (number === undefined) throw new Error(`Environment variable ${name} is not a valid number`);
    return number;
  }
  const env = process.env[name];
  return env ? stringVarToNumber(env, defaultVal) : defaultVal;
}

export const booleanVar = (name: string, defaultVal?: boolean): boolean => {
  if (defaultVal === undefined) {
    const stringVar = requireVar(name);
    if (stringVar !== 'FALSE' && stringVar !== 'TRUE') {
      throw new Error(`Environment variable ${name} should be either TRUE or FALSE`);
    }
    return stringVar === 'TRUE';
  }
  const env = process.env[name];
  return defaultVal === true ? env === 'FALSE' : defaultVal === false;
}
