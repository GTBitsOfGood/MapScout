# MapScout - Resource Map Maker
https://mapscout.io

Learn more about MapScout here: https://www.stephaniefhe.com/mapscout

## Build Instructions

1. Clone the repository

2. Run `yarn` (this is the yarn equivalent to npm install)

3. Run `yarn run secrets`, enter in your super secret password when prompted

**NOTE**: If you are using the Windows command prompt, you will need to manually enter in `yarn run secrets:login` and `yarn run secrets:sync`

4. Now you can run `yarn start` or `npm start` whenever you want to run the app

## Gitflow

The `master/main` branch automatically deploys to production, so all code should first go through the `develop` branch first. Mapscout only accepts code that has been approved from a Pull Request. In order to make changes to the code, we recommend the following steps:

1. Create a new branch from develop (e.i. `feature/coolLoginScreen`)

2. Create a pull request

3. Wait for approval from another developer

**NOTE**: You can create a new branch in command line with `git checkout -b myBranchName`. To check what branch you are on, you can run `git branch`. If you don't see a branch, try `git fetch origin`.

## Code Directory

![img](https://i.ibb.co/vdgXRjW/Screen-Shot-2021-01-26-at-3-26-40-PM.png)
![img2](https://i.ibb.co/f45gkVc/Screen-Shot-2021-01-26-at-3-26-47-PM.png)
