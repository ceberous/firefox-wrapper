# Firefox-Wrapper

```
const FirefoxWrapper = require( "firefox-wrapper" );

( async ()=> {
	let FFManager = new FirefoxWrapper();
	await FFManager.launchRewrite();
	FFManager.openNewTab( "https://github.com/ceberous/firefox-wrapper" );
	FFManager.x.fullScreen();
	FFManager.x.centerMouse();
	await FFManager.sleep( 3000 );
	FFManager.close();
})();
```
