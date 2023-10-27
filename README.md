# PAP Search Client

Client to perform searches in public administration publications indexed information from project [PAP-Search](https://github.com/pablomarino/pap-search).

## Install.
Install nodejs and npm. Then install angular-cli with `npm install -g @angular/cli`.

Run `npm install` to install all dependencies.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Problems with Cross Origin Resource Sharing (CORS)

If you have problems with CORS, you can enable it in the elasticsearch.yml file. For example:

```yml
http.cors.enabled: true
http.cors.allow-origin: "http://localhost:4200"
http.cors.allow-headers: "X-Requested-With, Content-Type, Content-Length, Authorization, access-control-allow-origin"
http.cors.allow-credentials: true
```

or install a plugin like [this one](https://devratroom.blogspot.com/p/cross-domain-cors-extension.html
) in your browser.
