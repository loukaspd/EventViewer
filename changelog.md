# Change Log

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).



## [0.2.2] 2020/09/03

### Added
- **[Packages]:** addsdb package
- **[log-selection]:** add add-to-favorites funcionality

### Changed
- **[app-window]:** moves app window to the center of the screen

### Fixed



## [0.2.1] 2020/08/25

### Added
- **[event-viewer]:** adds auto-refresh functionality
- **[event-viewer]:** adds source to filters

### Changed
- **[event-viewer] [ui]:** top bar position is fixed
- **[event-viewer] [ui]:** mac-like scrollbar
- **[ui]:** images are included in the app

### Fixed



## [0.2.0] 2020/08/05

### Added
- **[event-viewer] [ui]:** scroll to top functionality

### Changed
- **[AppLogger]:** introduce debug instance
- **[event-viewer]:** adds debug loging when command execution throws error
- **[event-viewer] [ui]:** moves bubble collapse button to top right

### Fixed
- **[log-selection]:** event-logs command parsing when thousands separator is '.' instead of ','
- **[event-viewer]:** fixes getEvents command to work on all windows languages
- **[event-viewer] [ui]:** optimize vertical scroll



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