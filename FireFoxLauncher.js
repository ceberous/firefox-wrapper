const path = require( "path" );
const ffpath = path.join( process.env.PWD ,"FireFoxLauncher.sh" );
const wSpawn = require("child_process").spawn;
const cp = wSpawn( ffpath );
cp.unref();
process.exit( 0 );