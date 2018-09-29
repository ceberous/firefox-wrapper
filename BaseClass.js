const path = require( "path" );
require( "shelljs/global" );
const shellescape = require( "shell-escape" );
const XDoToolWrapper = require( "xdotool-wrapper" );

const ffBinaryLocation1 = "/usr/lib/firefox/firefox";
const ffBinaryLocation2 = "/bin/sh -c firefox";
const checkFFOpen = "ps aux | grep firefox";
const SET_DISPLAY = "export DISPLAY=:0; ";
const FF_NEW_TAB = "firefox -new-tab ";
class FirefoxWrapperBase {

	constructor() {
		this.pid = undefined;
		this.binaryOpen = false;
		this.stagedLink = undefined;
		this.x = undefined;
		this.isOpen();
		if ( this.binaryOpen ) { this.close(); }
	}

	sleep( ms ) { return new Promise( function( resolve ) { setTimeout( resolve , ms ) } ); }

	isOpen() {
		let isFFOpen = exec( SET_DISPLAY + checkFFOpen , { silent:true , async: false } );
		if ( isFFOpen.stderr.length > 1 ) { console.log( "FirefoxWrapper --> ERROR --> Could not Locate FF Binary" ); return null; }
		
		isFFOpen = isFFOpen.stdout.split( "\n" );

		for ( let i = 0; i < isFFOpen.length; ++i ) {
			let wT = isFFOpen[ i ].split( " " );
			if ( wT[wT.length-1] === ffBinaryLocation1 ) {
				this.pid = wT[1].toString();
				//console.log( "is OPEN" );
				this.binaryOpen = true;
				return true;
			}
			else if ( ( wT[wT.length-3] + " " + wT[wT.length-2] + " " + wT[wT.length-1] ) === ffBinaryLocation2 ) {
				this.pid = wT[1].toString();
				//console.log( "is OPEN" );
				this.binaryOpen = true;
				return true;
			}
		}
		//console.log( "is CLOSED" );
		this.binaryOpen = false;
		return false;
	}

	async launchRewrite() {
		let wEX1 = exec( SET_DISPLAY + "node '" + path.join( __dirname , "FireFoxLauncher.js" ) + "' &" , { silent:true , async: false });
		if ( wEX1.stderr.length > 1 ) { console.log( "Firefox-Wrapper --> ERROR --> Could not Launch FF Binary" ); return null; }
		console.log( "Firefox-Wrapper --> Launched Firefox" );	
		this.x = new XDoToolWrapper.wrap.name( "Mozilla Firefox" );
		await this.x.ensureWindowNameIsReady();
		await this.sleep( 1000 );
		console.log( this.x.display );
	}

	async openNewTab( wURL ) {
		console.log( "Trying to Open New Tab" );
		let escaped = shellescape( [ wURL ] );
		let openNewTab = FF_NEW_TAB + escaped;
		console.log( openNewTab );
		let wResult = exec( SET_DISPLAY + openNewTab , { silent: true , async: false } );
		if ( wResult.stderr != null && wResult.stderr.length > 1 ) { console.log( "Firefox-Wrapper --> ERROR --> " + wResult.stderr ); return null; }
		await this.sleep( 1000 );
	}

	close() {
		let wEX2 = exec( "sudo pkill -9 firefox" , { silent: true ,  async: false } );
		if ( wEX2.stderr.length > 1 ) { console.log( "Firefox-Wrapper --> ERROR --> Could not Terminate FF Binary" ); return null; }
		console.log( "Firefox-Wrapper --> Killed Firefox" );		
	}

};
module.exports = FirefoxWrapperBase;