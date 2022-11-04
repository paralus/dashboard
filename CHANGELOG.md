# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

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

[Unreleased]: https://github.com/paralus/dashboard/compare/v0.1.5...HEAD
[0.1.5]: https://github.com/paralus/dashboard/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/paralus/dashboard/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/paralus/dashboard/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/paralus/dashboard/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/paralus/dashboard/compare/v0.1.1...v0.1.0
[0.1.0]: https://github.com/paralus/dashboard/releases/tag/v0.1.0
