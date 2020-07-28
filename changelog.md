# Change Log

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).


## [0.1.3] Pending

### Added

### Changed
- **[AppLogger]:**: introduce debug instance

### Fixed
- **[log-selection]:** event-logs command parsing when thousands separator is '.' instead of ','



## [0.1.2] 2020/07/28

### Added
- **[log-creation]:** adds EventLog and EventSource creation functionality inside log-selection modal
- **[Packages]:** adds AppLogger using electron-log package

### Changed

### Fixed



## [0.1.1] 2020/07/17

### Added
- **[log-selection]:** adds remove eventLog functionality

### Changed

### Fixed


## [0.1.0] 2020/07/17
New slack-like ui

### Added

### Changed
- **[Packages]:** updates electron 7.1.12 -> 7.2.4

### Fixed


## [0.0.3] 2020/02/24

### Added
- **[event-viewer]:** adds source to Events List
- **[event-viewer]:** adds source to filters
- **[event-viewer]:** show number of Events indicator
- **[log-selection]:** adds functionality to show only new Events

### Changed
- **[Packages]:** updates electron 6.0.10 -> 7.1.12
- filtering is done in memory
- **[main-component]:** show selection dialog when all tabs close

### Fixed
- powershell instance is disposed after each command is executed


## [0.0.2] 2019/11/11

### Added
- **[event-viewer]** adds filter implementation
- **[Clear Logs]** show confirmation modal

### Changed
- **[Clear Logs]** checks if running the app as administrator

### Fixed
- removes timeout when executing powershell requests
- set UTF8 encoding when executing ps commands