# Renderer3D

This is a project that explores 3D rendering. It allows you to draw 3D objects loaded from `.obj` files and provides a simple engine for creating interactive experiences.

## Where to find the official release?

The github repository for this project is public and can be found [here](https://github.com/sutaC/Renderer3D)

The official deploy is available at [this address](https://sutac-renderer3d.netlify.app/)

> The project is made and managed by [sutaC](https://github.com/sutaC)

## Documentation

The documentation is generated using TypeDoc and can be found [here](./docs/index.html)

> To generate documentation, simply use the command `npm run document`

## Technologies

- Svelte / SvelteKit
- Typescript
- TypeDoc

## Running project

1. Install dependencies using:

```bash
    npm install
```

3. Start a development server

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

App is build to static files created in `build/` directory.
