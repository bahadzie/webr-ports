#!/bin/bash
set -e

[[ -z $1 ]] && echo "Error: No package URL supplied" && exit 1
PKG_URL="$1"
[[ ${PKG_URL} =~ /([^/]+)_[-0-9\.]*\.tar\.gz ]]
PKG_NAME="${BASH_REMATCH[1]}"

RHOME=$(R RHOME)

rm -rf tmp
mkdir tmp
mkdir -p ~/.R
rm -f ~/.R/Makevars

cat << EOF > ~/.R/Makevars
CXX98=em++
CXX11=em++
CXX14=em++
CXX17=em++
CXX20=em++
CC=emcc
CXX=em++
CFLAGS=-std=gnu11 -I${RHOME}/include
CXXFLAGS=-std=gnu++11 -DRCPP_DEMANGLER_ENABLED=0 -D__STRICT_ANSI__ -I${RHOME}/include
CXX98FLAGS=-std=gnu++98 -DRCPP_DEMANGLER_ENABLED=0 -D__STRICT_ANSI__ -I${RHOME}/include
CXX11FLAGS=-std=gnu++11 -DRCPP_DEMANGLER_ENABLED=0 -D__STRICT_ANSI__ -I${RHOME}/include
CXX14FLAGS=-std=gnu++14 -DRCPP_DEMANGLER_ENABLED=0 -D__STRICT_ANSI__ -I${RHOME}/include
CXX17FLAGS=-std=gnu++17 -DRCPP_DEMANGLER_ENABLED=0 -D__STRICT_ANSI__ -I${RHOME}/include
CXX20FLAGS=-std=gnu++20 -DRCPP_DEMANGLER_ENABLED=0 -D__STRICT_ANSI__ -I${RHOME}/include
LDFLAGS=-s SIDE_MODULE=1 -s WASM_BIGINT -s ASSERTIONS=1
FC=emfc
FLIBS=
AR=emar
LAPACK_LIBS = ${RHOME}/src/modules/lapack/libRlapack.a
BLAS_LIBS = ${RHOME}/src/extra/blas/libRblas.a /app/build/Rlibs/lib/libgfortran.a /app/build/Rlibs/lib/libc/cabs.o /app/build/Rlibs/lib/libc/csqrt.o
ALL_CPPFLAGS=-DNDEBUG \$(PKG_CPPFLAGS) \$(CLINK_CPPFLAGS) \$(CPPFLAGS)
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
