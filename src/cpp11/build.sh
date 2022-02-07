#!/bin/bash
set -e

PKG_NAME="cpp11"
PKG_URL="https://cran.r-project.org/src/contrib/cpp11_0.4.2.tar.gz"

curl "${PKG_URL}" -o "${PKG_NAME}.tar.gz"
rm -rf root
mkdir -p root/usr/lib/R/library/
R CMD INSTALL --library="root/usr/lib/R/library" "${PKG_NAME}.tar.gz" --no-docs --no-test-load --no-staged-install

tar xvf "${PKG_NAME}.tar.gz"
cp -r "${PKG_NAME}"/inst .
rm -rf "${PKG_NAME}"
rm "${PKG_NAME}.tar.gz"

mkdir -p "../../dist/${PKG_NAME}/"
file_packager "../../dist/${PKG_NAME}/${PKG_NAME}.data" --js-output="../../dist/${PKG_NAME}/${PKG_NAME}.js" --preload 'root@/' --use-preload-plugins
rm -rf root
