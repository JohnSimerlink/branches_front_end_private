import {version} from './package.json';
import {log} from './app/core/log';
import { execSync } from 'child_process';
execSync(`git commit -m "Build Version: ${version}-${Date.now()}"`)
