import { Get } from 'type-fest';
import path from 'ramda/src/path';

const get = <BaseType, Path extends string>(object: BaseType, pathname: Path): Get<BaseType, Path> =>
  path(pathname.split('.'), object)!;
export default get;
