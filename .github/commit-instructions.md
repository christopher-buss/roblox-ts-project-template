<type>(<scope>): <subject>

<body>

<footer>

## Type should be one of the following:

- feat: a new feature
- fix: a bug fix
- docs: documentation only changes
- style: changes that do not affect the meaning of the code
- refactor: a code change that neither fixes a bug nor adds a feature
- perf: a code change that improves performance
- test: adding missing tests or correcting existing tests
- build: changes that affect the build system or external dependencies
- ci: changes to our ci configuration files and scripts
- chore: other changes that don't modify src or test files
- revert: reverts a previous commit

Use "<type>(<scope>)!" for breaking changes

## Scope is optional, but should be one of the following:

- assets: changes to assets (images, fonts, etc.)
- audio: changes relating to sound or music
- core: changes to the core game functionality
- deps: changes to dependencies
- dev: changes to the development environment
- lint: changes that only affect linting such as auto-formatting
- mtx: changes to monetization or in-game purchases

## Subject line rules:

- Use imperative mood: "change" not "changed" nor "changes"
- No dot (.) at the end
- Limit to 72 characters
- No capitilization in the subject aside from issue references

## Body rules:

- Wrap at 72 characters
- Use imperative mood
- Explain what and why vs. how Footer rules:
- Reference issues and pull requests liberally
- Use "Fixes #123" or "Closes #123" for issues
