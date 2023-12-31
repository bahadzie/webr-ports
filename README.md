# webR Ports - R packages ported for webR

## NOTE: ARCHIVED

This repository has been archived. All future development will be at https://github.com/r-wasm/webr-repo.

## Using webR packages

The R packages in this repo are built and distributed in the `dist` directory, and so can be loaded directly into the
webR javascript environment using https://cdn.jsdelivr.net/gh/georgestagg/webr-ports/dist/

The webR javascript loader at georgestagg/webR provides the `loadPackage(package_name)` JS command, which loads the named
package into the virtual filesystem. At that point the package can be loaded with R's `library(package_name)` command.

## Building Packages

The simplest way to build these packages is within the environment provided by the docker image at georgestagg/webR.

* Ensure both native R and the emscripten toolchain (including the `tools` directory) are installed and on the PATH
* Enter the `src/package_name` directory and then run `./build.sh`
* The resulting package is placed in `dist/package_name`

## Package List

The following packages, along with their dependencies, are available:

* dplyr
* forcats
* ggplot2
* ncldata
* purrr
* readr
* stringr
* svglite
* tibble
* tidyr
