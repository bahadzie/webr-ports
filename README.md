# webR Ports - R packages ported for webR

## Using webR packages

The R packages in this repo are built and distributed in the `dist` directory, and so can be loaded directly into the
webR javascript environment using https://cdn.jsdelivr.net/gh/georgestagg/webr-ports/dist/

## Building Packages

* Ensure both R and emscripten (including the `tools` directory) are installed and on the PATH in the current environment
* Enter the `src/package_name` directory and then run `./build.sh`
* The resulting package is placed in `dist/package_name`

## Package List

* ncldata
