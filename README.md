# roblox-ts template

This is my personal template for use in the roblox-ts ecosystem, utilizing
popular libraries and tools such as Flamework, React, and Reflex. For a
comprehensive list of packages, refer to the `package.json` file.

The primary objective of this project is to provide a streamlined approach for
initiating new projects, complete with frequently used patterns that I adopt
already configured. Additionally, it integrated my own customized eslint-config,
which is a highly opinionated guide for writing clean and consistent code.

### Warning ⚠️

My eslint-config is very strict and highly opinionated and may not be suitable
for beginners or people who prefer a more relaxed coding style. If you would
like to use this template without my eslint-config, you can remove it from
the `package.json` file, remove the `eslint.config.ts` file, along with the
`tsconfig.build.json` file, and then replace it with your own configuration.

### How to use:

1. Press the green `Use this template` button on the top right of the page to
   create a new repository.
2. Clone the repository to your local machine.
3. Run `pnpm install` to install all of the dependencies.
4. Run `pnpm run watch-dev` to start the development server.
5. Sync in with rojo (either by using the rojo extension or by running `pnpm run
sync-dev`).
6. Start coding! 🎉

### Resources

#### Packages

-   [Flamework](https://flamework.fireboltofdeath.dev/)
-   [Janitor](https://howmanysmall.github.io/Janitor/)
-   [Lapis](https://nezuo.github.io/lapis/)
-   [Log](https://www.npmjs.com/package/@rbxts/log)
-   [React](https://www.npmjs.com/package/@rbxts/react)
-   [Reflex](https://littensy.github.io/reflex/docs/guides/)
-   [Ripple](https://github.com/littensy/ripple)
-   [UI Labs](https://ui-labs-roblox.github.io/ui-labs-docs/)

#### Tools

-   [Darklua](https://darklua.com/)
-   [ESLint config](https://github.com/christopher-buss/roblox-ts-eslint-config)
-   [ESLint](https://eslint.org/)
-   [Rojo](https://rojo.space/)
-   [pnpm](https://pnpm.io/)
-   [roblox-ts](https://roblox-ts.com/)

## Guide

The following is a guide to the tools of the project and how to typically use
them.

### Syncing with Rojo

While in development, I would typically use the `pnpm run watch-dev` command to
start the development server, and then use the `pnpm run sync-dev` command to
sync the project with Rojo.

To publish the project, I would use the `pnpm run build-prod` command to build
the game project with the production configuration. This will delete your
current `out` folder, replace it with the new build, and then automatically runs
darklua on the project (outputting the game project to the `dist` folder). This
allows us to completely remove any development only code, such that it does not
even exist in the final game project.

### Tip

All of the commands can be found in the `package.json` file under the `scripts`.
These can be accessed in VSCode through the `npm scripts` tab in the sidebar,
where you can run them by clicking the play button next to the command.

### Contributing

As this is a personal template, I am not typically seeking contributions.
However, if you discover any bugs, feel free to create a pull request or an
issue, and I will address it. If you wish to suggest a feature or improvement,
please submit an issue first to initiate discussion!

## Credits 🙏

Some of the code in this template has been taken from others and modified for my
usage, and I would like to give credit to the following people and projects:

-   [Grilme99 (Tabletop Island)](https://github.com/grilme99/tabletop-island/)
-   [Littensy (Slither)](https://github.com/littensy/slither/)
