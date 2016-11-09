# Changelog

Live on Stage adheres to [Semantic Versioning](http://semver.org/).

## [2.0.13] 2016-11-09

### Fixed
- Checking for viewport manual check.

## [2.0.12] 2016-10-14

### Added
- Callbacks called with viewport data as second argument.

## [2.0.11] 2016-10-14

### Fixed
- Incorrect id being pushed to idsToCheck

## [2.0.10] 2016-10-14

### Added
- `manuallyCheckAll` method.
- `onScroll` event.

## [2.0.9] 2016-09-13

### Added
- Moved initial measurements to a `rAF` callback to let the DOM settle after adding multiple new elements.

## [2.0.8] 2016-08-23

### Added
- Changing `offset` measurements back to `getBoundingClientRect` for accuracy.

## [2.0.7] 2016-08-21

### Added
- Changing `getBoundingClientRect` to `offset` measurements.

## [2.0.5] 2016-08-09

### Added
- `onMeasure` callback.

## [2.0.0] 2016-05-30

### Added
- Performance improvements.
- New API.
- React component.

### Changed
- Moved to Popmotion organisation.
