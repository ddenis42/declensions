

### Starting the Development Server
To start the development server with hot-reload, run the following command. The server will be accessible at [http://localhost:3000](http://localhost:3000):
```bash
pnpm dev
```

> Add NODE_OPTIONS='--no-warnings' to suppress the JSON import warnings that happen as part of the Vuetify import mapping. If you are on Node [v21.3.0](https://nodejs.org/en/blog/release/v21.3.0) or higher, you can change this to NODE_OPTIONS='--disable-warning=5401'. If you don't mind the warning, you can remove this from your package.json dev script.

### Building for Production
To build project for production
```bash
pnpm build
```

## 💪 Support

## 📑 License
[MIT](https://github.com/ddenis42/declensions/blob/main/LICENSE)
