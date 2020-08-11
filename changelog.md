# Changelog

## v1.1.0- Tuesday, August 11, 2020

### Updates

- Update docker deploy scripts
- Remove db directory and use @pathcheck/data-layer in its place
- Move service to @pathcheck/server-lib
- General cleanup of repo
- Update README


### Breaking Changes

- The `EXPRESSPORT` environment variable is required to configure what port the express server is to run on (will default to port `3000` if it is not) 

