#!/bin/bash
set -e

PKG_NAME="nlme"
PKG_URL="https://cran.r-project.org/src/contrib/nlme_3.1-155.tar.gz"

curl "${PKG_URL}" -o "${PKG_NAME}.tar.gz"
rm -rf root

cat << EOF > ~/.R/Makevars 
CC=emcc
CFLAGS=-std=gnu11 -I/app/build/R-4.1.2/include
LDFLAGS=-s SIDE_MODULE=1 -s WASM_BIGINT -s ASSERTIONS=1
FC=emfc
EOF

tar xvf "${PKG_NAME}.tar.gz"
cd "${PKG_NAME}"
patch --ignore-whitespace -p1 < "../patches/${PKG_NAME}.patch"

# Compile manually to avoid linking to system gfortran
cd src
emfc  -fpic  -g -O2  -c chol.f -o chol.o
emcc -I"/app/build/R-4.1.2_orig/include" -DNDEBUG   -I/usr/local/include  -fvisibility=hidden -fpic  -std=gnu11 -I/app/build/R-4.1.2/include -c corStruct.c -o corStruct.o
emcc -I"/app/build/R-4.1.2_orig/include" -DNDEBUG   -I/usr/local/include  -fvisibility=hidden -fpic  -std=gnu11 -I/app/build/R-4.1.2/include -c gnls.c -o gnls.o
emcc -I"/app/build/R-4.1.2_orig/include" -DNDEBUG   -I/usr/local/include  -fvisibility=hidden -fpic  -std=gnu11 -I/app/build/R-4.1.2/include -c init.c -o init.o
emcc -I"/app/build/R-4.1.2_orig/include" -DNDEBUG   -I/usr/local/include  -fvisibility=hidden -fpic  -std=gnu11 -I/app/build/R-4.1.2/include -c matrix.c -o matrix.o
emcc -I"/app/build/R-4.1.2_orig/include" -DNDEBUG   -I/usr/local/include  -fvisibility=hidden -fpic  -std=gnu11 -I/app/build/R-4.1.2/include -c nlOptimizer.c -o nlOptimizer.o
emcc -I"/app/build/R-4.1.2_orig/include" -DNDEBUG   -I/usr/local/include  -fvisibility=hidden -fpic  -std=gnu11 -I/app/build/R-4.1.2/include -c nlme.c -o nlme.o
emcc -I"/app/build/R-4.1.2_orig/include" -DNDEBUG   -I/usr/local/include  -fvisibility=hidden -fpic  -std=gnu11 -I/app/build/R-4.1.2/include -c nlmefit.c -o nlmefit.o
emcc -I"/app/build/R-4.1.2_orig/include" -DNDEBUG   -I/usr/local/include  -fvisibility=hidden -fpic  -std=gnu11 -I/app/build/R-4.1.2/include -c pdMat.c -o pdMat.o
emcc -I"/app/build/R-4.1.2_orig/include" -DNDEBUG   -I/usr/local/include  -fvisibility=hidden -fpic  -std=gnu11 -I/app/build/R-4.1.2/include -c pythag.c -o pythag.o
emfc  -fpic  -g -O2  -c rs.f -o rs.o
curl "https://www.netlib.org/linpack/dpofa.f" -o dpofa.f
emfc  -fpic  -g -O2  -c dpofa.f -o dpofa.o
emcc -shared -s SIDE_MODULE=1 -s WASM_BIGINT -s ASSERTIONS=1 -o nlme.so dpofa.o chol.o corStruct.o gnls.o init.o matrix.o nlOptimizer.o nlme.o nlmefit.o pdMat.o pythag.o rs.o
cd ../..

mkdir -p root/usr/lib/R/library/
R CMD INSTALL --library="root/usr/lib/R/library" "${PKG_NAME}" --no-docs --no-test-load --no-staged-install --no-byte-compile --no-libs
mkdir "root/usr/lib/R/library/${PKG_NAME}/libs"
cp "${PKG_NAME}/src/${PKG_NAME}.so" "root/usr/lib/R/library/${PKG_NAME}/libs/${PKG_NAME}.so"

rm -rf "${PKG_NAME}"
rm "${PKG_NAME}.tar.gz"

mkdir -p "../../dist/${PKG_NAME}/"
file_packager "../../dist/${PKG_NAME}/${PKG_NAME}.data" --js-output="../../dist/${PKG_NAME}/${PKG_NAME}.js" --preload 'root@/' --use-preload-plugins
rm -rf root
rm ~/.R/Makevars
