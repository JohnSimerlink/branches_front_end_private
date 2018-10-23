import {version} from './package.json';
import {log} from './app/core/log';
import { execSync } from 'child_process';
log(`the version is ${version + typeof version}`)

log('execSync is ', execSync)
execSync(`git commit -m "Build Version: ${version}-${Date.now()}`)
