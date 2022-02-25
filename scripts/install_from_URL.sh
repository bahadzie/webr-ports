#!/bin/bash
set -e

[[ -z $1 ]] && echo "Error: No package URL supplied" && exit 1
PKG_URL="$1"
[[ ${PKG_URL} =~ /([^/]+)_[-0-9\.]*\.tar\.gz ]]
PKG_NAME="${BASH_REMATCH[1]}"

rm -rf tmp
mkdir tmp
rm -f ~/.R/Makevars

cat << \EOF > ~/.R/Makevars
CXX98=em++
CXX11=em++
CXX14=em++
CXX17=em++
CXX20=em++
CC=emcc
CXX=em++
CFLAGS=-std=gnu11 -I/app/build/R-4.1.2/include
CXXFLAGS=-std=gnu++11 -D__STRICT_ANSI__ -I/app/build/R-4.1.2/include
CXX98FLAGS=-std=gnu++98 -I/app/build/R-4.1.2/include
CXX11FLAGS=-std=gnu++11 -I/app/build/R-4.1.2/include
CXX14FLAGS=-std=gnu++14 -I/app/build/R-4.1.2/include
CXX17FLAGS=-std=gnu++17 -I/app/build/R-4.1.2/include
CXX20FLAGS=-std=gnu++20 -I/app/build/R-4.1.2/include
LDFLAGS=-s SIDE_MODULE=1 -s WASM_BIGINT -s ASSERTIONS=1
FC=emfc
FLIBS=
AR=emar
LAPACK_LIBS = /app/build/R-4.1.2/src/modules/lapack/libRlapack.a
BLAS_LIBS = /app/build/R-4.1.2/src/extra/blas/libRblas.a /app/build/Rlibs/lib/libgfortran.a /app/build/Rlibs/lib/libc/cabs.o /app/build/Rlibs/lib/libc/csqrt.o
ALL_CPPFLAGS=-DNDEBUG $(PKG_CPPFLAGS) $(CLINK_CPPFLAGS) $(CPPFLAGS)
EOF

cd tmp
curl "${PKG_URL}" -o "${PKG_NAME}.tar.gz"
tar xvf "${PKG_NAME}.tar.gz"
mkdir -p root/usr/lib/R/library/
R CMD INSTALL --library="root/usr/lib/R/library" "${PKG_NAME}" --no-docs --no-test-load --no-staged-install --no-byte-compile
rm -rf "${PKG_NAME}"
rm "${PKG_NAME}.tar.gz"

mkdir -p "../../dist/${PKG_NAME}/"
file_packager "../../dist/${PKG_NAME}/${PKG_NAME}.data" --js-output="../../dist/${PKG_NAME}/${PKG_NAME}.js" --preload 'root@/' --use-preload-plugins
cd ..

rm -rf tmp
rm -f ~/.R/Makevars
