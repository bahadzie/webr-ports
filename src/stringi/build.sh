#!/bin/bash
set -e

PKG_NAME="stringi"
PKG_URL="https://cloud.r-project.org/src/contrib/stringi_1.7.6.tar.gz"

curl "${PKG_URL}" -o "${PKG_NAME}.tar.gz"
rm -rf root

cat << EOF > ~/.R/Makevars 
CC=emcc
CXX=em++
CXX11=em++
CXX11FLAGS=-std=gnu++11 -D__STRICT_ANSI__ -I/app/build/R-4.1.2/include
LDFLAGS=-s SIDE_MODULE=1 -s WASM_BIGINT -s ASSERTIONS=1
AR=emar
EOF

tar xvf "${PKG_NAME}.tar.gz"
cd "${PKG_NAME}"
# Some nasty patches to ignore some checks in configure script
patch --ignore-whitespace -p1 < "../patches/${PKG_NAME}.patch"
cd ..

mkdir -p root/usr/lib/R/library/
R CMD INSTALL --library="root/usr/lib/R/library" "${PKG_NAME}" --no-docs --no-test-load --no-staged-install --no-byte-compile
rm -rf "${PKG_NAME}"
rm "${PKG_NAME}.tar.gz"
rm "root/usr/lib/R/library/${PKG_NAME}/libs/icudt55l.dat"

mkdir -p "../../dist/${PKG_NAME}/"
file_packager "../../dist/${PKG_NAME}/${PKG_NAME}.data" --js-output="../../dist/${PKG_NAME}/${PKG_NAME}.js" --preload 'root@/' --use-preload-plugins
rm -rf root
rm ~/.R/Makevars
