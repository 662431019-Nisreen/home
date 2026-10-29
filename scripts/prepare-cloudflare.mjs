import {readFileSync,writeFileSync} from 'node:fs';
const databaseId=process.argv[2];
if(!databaseId||!/^[a-f0-9-]{36}$/i.test(databaseId))throw new Error('Pass the real D1 database ID');
const built=JSON.parse(readFileSync('dist/server/wrangler.json','utf8'));
const config={name:'baan-rao-expenses',account_id:'217f7d6c1ae649af0033f8efeef80f4f',main:'dist/server/index.js',compatibility_date:built.compatibility_date,compatibility_flags:['nodejs_compat'],no_bundle:true,workers_dev:true,assets:{directory:'dist/client',binding:'ASSETS',run_worker_first:['/family-home.png']},d1_databases:[{binding:'DB',database_name:'baan-rao-expenses-db',database_id:databaseId,migrations_dir:'drizzle'}],rules:built.rules};
writeFileSync('wrangler.cloudflare.json',JSON.stringify(config,null,2)+'\n');
console.log('Prepared Cloudflare deployment config');
