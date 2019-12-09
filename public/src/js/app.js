const manifest = {
    "name": "Demo Progressive Web App",
    "short_name": "Demo PWA",
    "description": "foo bar bla",
    "icons": [
        {
            "src": "src/images/icons/app-icon-48x48.png",
            "type": "image/png",
            "sizes": "48x48"
        },
        {
            "src": "src/images/icons/app-icon-512x512.png",
            "type": "image/png",
            "sizes": "512x512"
        }
    ],
    "src": "src/images/icons/app-icon-512x512.png",
    "type": "image/png",
    "sizes": "512x512",
    "display": "fullscreen",
    "orientation": "portrait-primary",
    "background_color": "#fff",
    "theme_color": "#3f51b5",
    "description": "Take selfies PWA style.",
    "dir": "ltr",
    "lang": "en-US"
};
// Replace { ... } with the content of the manifest.json file and remove the "start_url" and "scope” !!!
window.addEventListener('load', () => {
    const base = document.querySelector('base');
    let baseUrl = base && base.href || '';
    if (!baseUrl.endsWith('/')) {
        baseUrl = `${baseUrl}/`;
    }

    manifest['start_url'] = `${baseUrl}index.html`;
    manifest.icons.forEach(icon => {
        icon.src = `${baseUrl}${icon.src}`;
    });
    const stringManifest = JSON.stringify(manifest);
    const blob = new Blob([stringManifest], {type: 'application/json'});
    const manifestURL = URL.createObjectURL(blob);
    document.querySelector('#manifestPlaceholder').setAttribute('href', manifestURL);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(`${baseUrl}sw.js`)
            .then( registration => {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(err => {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
    }
});
