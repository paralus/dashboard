## [0.2.5](https://github.com/paralus/dashboard/compare/v0.2.4...v0.2.5) (2026-01-14)

### Dependencies

- upgraded kratos client sdk from `v1.1.0` to `v25.4.0`
- removed depricated dependencies `create-react-context` and `node-saas`

## [0.2.4](https://github.com/paralus/dashboard/compare/v0.2.3...v0.2.4) (2025-05-23)

### Dependencies

* upgrade node nginx deps ([68eab5b](https://github.com/paralus/dashboard/commit/68eab5bb22975b50ab9c7b0f3917ea58aea2db93))

### Security Fixes

* package.json & yarn.lock to reduce vulnerabilities ([e60c010](https://github.com/paralus/dashboard/commit/e60c01055d5c09f6df6f487a308ed1d78406cbdb))

## [0.2.3](https://github.com/paralus/dashboard/compare/v0.2.2...v0.2.3) (2024-06-14)

### Features

* add description field for project and cluster card ([#251](https://github.com/paralus/dashboard/issues/251)) ([68b23d9](https://github.com/paralus/dashboard/commit/68b23d9933f0408c925dd96967ecc31889467460))

## [0.2.2](https://github.com/paralus/dashboard/compare/v0.2.1...v0.2.2) (2024-02-28)

### Features

* changes for cluster connection status and defaulting to card lister ([#237](https://github.com/paralus/dashboard/issues/237)) ([be7d5cb](https://github.com/paralus/dashboard/commit/be7d5cb4f2a203d5bf4ad0c293c61111e128e31a))

## [0.2.1](https://github.com/paralus/dashboard/compare/v0.2.0...v0.2.1) (2023-09-25)

### Features
* changes to view auditlogs by project role users ([#225](https://github.com/paralus/paralus/issues/225)) ([11556ac](https://github.com/paralus/dashboard/commit/11556aca1661a6d4d59ab0412f6420b96920f383))

## [0.2.0](https://github.com/paralus/dashboard/compare/v0.1.9...v0.2.0) (2023-04-28)

### Bug Fixes

* pinned IDP mapper url to v0.2.2 version ([#173](https://github.com/paralus/dashboard/issues/173)) ([7825659](https://github.com/paralus/dashboard/commit/78256593361397a2a0703922b4952dee8053166f))

## [0.1.9]- 2023-03-31
### Fixed
- Fix showing Kratos information on error page [akshay196](https://github.com/akshay196)

## [0.1.8]- 2023-02-24
### Fixed
- Fix for handling delete of IDP Users [mabhi](https://github.com/mabhi)
- Namespace limitation [mabhi](https://github.com/mabhi)

### Added
-  Configure the service account lifetime from [mabhi](https://github.com/mabhi)

## [0.1.7]- 2023-01-27
### Added
- Enhance: Navigate user to reset page using force reset during first login [mabhi](https://github.com/mabhi)
- Upgraded Ory Kratos client to v0.10.1 [akshay196](https://github.com/akshay196)


## [0.1.6]- 2022-12-29
### Fixed
- Fix for switching between projects when logged in as non-admin [mabhi](https://github.com/mabhi)
- Fix access to cluster manage buttons shown for users without cluster write permission from [mabhi](https://github.com/mabhi)

## [0.1.5]- 2022-11-04
### Added
- Show last access time in users list page from [akshay196](https://github.com/akshay196)

### Fixed
- Fix for IdP users unable to login from [niravparikh05](https://github.com/niravparikh05)
- Fix wrong cluster delete success message for non-priviledged users from [niravparikh05](https://github.com/niravparikh05)

## [0.1.4]- 2022-10-14
### Changed
- Hide copy button in user reset screen for non https webpages from [niravparikh05](https://github.com/niravparikh05)
- Default to kubectl tab view in audit logs from [niravparikh05](https://github.com/niravparikh05)
- Remove groups and client column from audit logs system and kubectl commands tab from [niravparikh05](https://github.com/niravparikh05)
- Make user clickable in auditlogs kubectl commands tab to view user details like group from [niravparikh05](https://github.com/niravparikh05)

## [0.1.3]- 2022-10-10
### Fixed
- Added web kubectl in cluster list page and removed type agent columns from auditlogs from [niravparikh05](https://github.com/niravparikh05)

## [0.1.2] - 2022-09-30
### Fixed
- Fix download kubeconfig file name issue from [akshay196](https://github.com/akshay196)
- Ui cleanups in cluster lister, import and config screens from [niravparikh05](https://github.com/niravparikh05)
- Fixed login failing right after logout from [meain](https://github.com/meain)
- Cluster tabular list view set to default and added user recovery link copy icon [niravparikh05](https://github.com/niravparikh05)

## [0.1.1] - 2022-08-09
### Changed
- Hide copy button on non https webpages from [meain](https://github.com/meain)
- Removed building images to registry on pull requests from [niravparikh05](https://github.com/niravparikh05)
- Added logo to the main login page empty from [plagzee](https://github.com/plagzee)

### Fixed
- Fix blank screen on initial login from [meain](https://github.com/meain)
- Fix time/date rendering in audit logs from [meain](https://github.com/meain)
- Invalid date displayed on cluster page from [niravparikh05](https://github.com/niravparikh05)
- Project manage membership: Should not be able to associate org role to users and groups from [niravparikh05](https://github.com/niravparikh05)
- Project manage membership: Unable to associate inbuilt namespaced roles to users and groups from [niravparikh05](https://github.com/niravparikh05)

## [0.1.0] - 2022-06-22
### Added
- Initial release

[Unreleased]: https://github.com/paralus/dashboard/compare/v0.2.2...HEAD
[0.2.2]: https://github.com/paralus/dashboard/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/paralus/dashboard/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/paralus/dashboard/compare/v0.1.9...v0.2.0
[0.1.9]: https://github.com/paralus/dashboard/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/paralus/dashboard/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/paralus/dashboard/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/paralus/dashboard/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/paralus/dashboard/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/paralus/dashboard/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/paralus/dashboard/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/paralus/dashboard/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/paralus/dashboard/compare/v0.1.1...v0.1.0
[0.1.0]: https://github.com/paralus/dashboard/releases/tag/v0.1.0
