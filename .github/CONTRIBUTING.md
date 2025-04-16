# Contributing to Traceform

First off, thank you for considering contributing to Traceform! It's people like you that make Traceform such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check our [issues](https://github.com/lucidlayer/traceform/issues) if there's something similar to what you have in mind. If not, feel free to open a new issue!

## Fork & create a branch

If you decided to fix an issue or implement a new feature, fork the repository and create a branch with a descriptive name.

A good branch name would be (where issue #123 is the ticket you're working on):

```bash
git checkout -b 123-fix-babel-plugin-path-issue
```

## Get the code

```bash
git clone https://github.com/<your-username>/traceform.git
cd traceform
npm install
```

## Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first :smile_cat:

## Make a Pull Request

At this point, you should switch back to your main branch and make sure it's up to date with Traceform's main branch:

```bash
git checkout main
git pull upstream main
```

Then update your feature branch from your local copy of main, and push it!

```bash
git checkout 123-fix-babel-plugin-path-issue
git rebase main
git push --set-upstream origin 123-fix-babel-plugin-path-issue
```

Finally, go to GitHub and make a Pull Request.

## Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

To learn more about rebasing in Git, there are a lot of good resources, but here's the suggested workflow:

```bash
git checkout 123-fix-babel-plugin-path-issue
git pull upstream main
git rebase upstream/main
git push --force-with-lease 123-fix-babel-plugin-path-issue
```

## Code Style

Please follow the existing code style (ESLint + Prettier). Run `npm run lint` and `npm run format` before committing.

Thank you for contributing!
