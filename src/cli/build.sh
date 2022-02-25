#!/bin/bash
set -e

PKG_NAME="cli"
PKG_URL="https://cran.r-project.org/src/contrib/cli_3.2.0.tar.gz"

curl "${PKG_URL}" -o "${PKG_NAME}.tar.gz"
rm -rf root

cat << EOF > ~/.R/Makevars 
CC=emcc
LDFLAGS=-s SIDE_MODULE=1 -s WASM_BIGINT -s ASSERTIONS=1
EOF

tar xvf "${PKG_NAME}.tar.gz"
cd "${PKG_NAME}"
patch --ignore-whitespace -p1 < "../patches/${PKG_NAME}.patch"
cd ..

mkdir -p root/usr/lib/R/library/
R CMD INSTALL --library="root/usr/lib/R/library" "${PKG_NAME}" --no-docs --no-test-load --no-staged-install --no-byte-compile

rm -rf "${PKG_NAME}"
rm "${PKG_NAME}.tar.gz"

mkdir -p "../../dist/${PKG_NAME}/"
file_packager "../../dist/${PKG_NAME}/${PKG_NAME}.data" --js-output="../../dist/${PKG_NAME}/${PKG_NAME}.js" --preload 'root@/' --use-preload-plugins
rm -rf root
rm ~/.R/Makevars
