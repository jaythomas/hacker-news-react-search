# Hacker News React Search

[![License](https://img.shields.io/badge/License-MIT-blue)](https://github.com/jaythomas/hacker-news-react-search/blob/master/LICENSE.md)

- [Setup](#setup)
- [Testing](#testing)
- [Additional commands](#additional-commands)


This is a demo React application built without scaffolding (read: no create-react-app) to create something that simultaneously has minimal boilerplate and is scalable so as to be useful for seeding a larger application.

## Setup

Run yarn to install node dependencies for building the application:

`yarn`

Then run the dev server:

`yarn start`

If you don't have yarn, you can find installation instructions [here](https://classic.yarnpkg.com/lang/en/). (You could also try npm if you have that but the lockfiles are different between the two tools so you may end up with different dependencies installed and things not work correctly.)

## Testing

`yarn test`

This will run the linter and unit tests (jest).

## Production build

You can build a production distributable by running the following command:

`yarn build`

This will generate a directory called `dist/` which can be deployed to an http server of your choice.

## Additional commands

If I missed any commands above, you can get a printout of them by running:

`yarn run`

Or by simply running `cat package.json` and checking out the defined "scripts".
