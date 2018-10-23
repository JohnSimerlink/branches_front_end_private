import {version} from './package.json';
import {log} from './app/core/log';
import { execSync } from 'child_process';
//
log(Date.now(), 'execSync is ', execSync)
