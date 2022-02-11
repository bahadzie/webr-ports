#!/bin/bash
set -e

PKG_NAME="ncldata"
PKG_URL="https://www.mas.ncl.ac.uk/~ngs54/ncldata_1.4.tar.gz"

curl "${PKG_URL}" -o "${PKG_NAME}.tar.gz"
rm -rf root
mkdir -p root/usr/lib/R/library/
R CMD INSTALL --library="root/usr/lib/R/library" "${PKG_NAME}.tar.gz" --no-docs --no-test-load --no-staged-install --no-byte-compile
rm "${PKG_NAME}.tar.gz"

mkdir -p "../../dist/${PKG_NAME}/"
file_packager "../../dist/${PKG_NAME}/${PKG_NAME}.data" --js-output="../../dist/${PKG_NAME}/${PKG_NAME}.js" --preload 'root@/' --use-preload-plugins
rm -rf root
