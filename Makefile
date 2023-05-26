
## changelog: generate changelog (latest release)
.PHONY: changelog
changelog:
	conventional-changelog -i CHANGELOG.md -s -p conventionalcommits
