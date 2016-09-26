import fs from 'fs';
import {promisifyAll} from '@common/utils/promisify';

export default promisifyAll(fs);
