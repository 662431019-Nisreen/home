import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
const r=spawnSync(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js',...process.argv.slice(2)],{stdio:'inherit',env:{...process.env,XDG_CONFIG_HOME:resolve('.wrangler/credentials')}});
process.exit(r.status??1);
