
  var Module = typeof Module !== 'undefined' ? Module : {};
  
  if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
  }
  Module.expectedDataFileDownloads++;
  (function() {
    // When running as a pthread, FS operations are proxied to the main thread, so we don't need to
    // fetch the .data bundle on the worker
    if (Module['ENVIRONMENT_IS_PTHREAD']) return;
    var loadPackage = function(metadata) {
  
      var PACKAGE_PATH = '';
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
      } else if (typeof process === 'undefined' && typeof location !== 'undefined') {
        // web worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
      }
      var PACKAGE_NAME = '../../dist/cpp11/cpp11.data';
      var REMOTE_PACKAGE_BASE = 'cpp11.data';
      if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
        Module['locateFile'] = Module['locateFilePackage'];
        err('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
      }
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
    
      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];
      var PACKAGE_UUID = metadata['package_uuid'];
    
      function fetchRemotePackage(packageName, packageSize, callback, errback) {
        
        if (typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string') {
          require('fs').readFile(packageName, function(err, contents) {
            if (err) {
              errback(err);
            } else {
              callback(contents.buffer);
            }
          });
          return;
        }
      
        var xhr = new XMLHttpRequest();
        xhr.open('GET', packageName, true);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = function(event) {
          var url = packageName;
          var size = packageSize;
          if (event.total) size = event.total;
          if (event.loaded) {
            if (!xhr.addedTotal) {
              xhr.addedTotal = true;
              if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
              Module.dataFileDownloads[url] = {
                loaded: event.loaded,
                total: size
              };
            } else {
              Module.dataFileDownloads[url].loaded = event.loaded;
            }
            var total = 0;
            var loaded = 0;
            var num = 0;
            for (var download in Module.dataFileDownloads) {
            var data = Module.dataFileDownloads[download];
              total += data.total;
              loaded += data.loaded;
              num++;
            }
            total = Math.ceil(total * Module.expectedDataFileDownloads/num);
            if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
          } else if (!Module.dataFileDownloads) {
            if (Module['setStatus']) Module['setStatus']('Downloading data...');
          }
        };
        xhr.onerror = function(event) {
          throw new Error("NetworkError for: " + packageName);
        }
        xhr.onload = function(event) {
          if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            var packageData = xhr.response;
            callback(packageData);
          } else {
            throw new Error(xhr.statusText + " : " + xhr.responseURL);
          }
        };
        xhr.send(null);
      };

      function handleError(error) {
        console.error('package error:', error);
      };
    
        var fetchedCallback = null;
        var fetched = Module['getPreloadedPackage'] ? Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;

        if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
          if (fetchedCallback) {
            fetchedCallback(data);
            fetchedCallback = null;
          } else {
            fetched = data;
          }
        }, handleError);
      
    function runWithFS() {
  
      function assert(check, msg) {
        if (!check) throw msg + new Error().stack;
      }
  Module['FS_createPath']("/", "usr", true, true);
Module['FS_createPath']("/usr", "lib", true, true);
Module['FS_createPath']("/usr/lib", "R", true, true);
Module['FS_createPath']("/usr/lib/R", "library", true, true);
Module['FS_createPath']("/usr/lib/R/library", "cpp11", true, true);
Module['FS_createPath']("/usr/lib/R/library/cpp11", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/cpp11", "include", true, true);
Module['FS_createPath']("/usr/lib/R/library/cpp11/include", "cpp11", true, true);
Module['FS_createPath']("/usr/lib/R/library/cpp11/include", "fmt", true, true);
Module['FS_createPath']("/usr/lib/R/library/cpp11", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/cpp11", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/cpp11", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/cpp11", "help", true, true);

          /** @constructor */
          function DataRequest(start, end, audio) {
            this.start = start;
            this.end = end;
            this.audio = audio;
          }
          DataRequest.prototype = {
            requests: {},
            open: function(mode, name) {
              this.name = name;
              this.requests[name] = this;
              Module['addRunDependency']('fp ' + this.name);
            },
            send: function() {},
            onload: function() {
              var byteArray = this.byteArray.subarray(this.start, this.end);
              this.finish(byteArray);
            },
            finish: function(byteArray) {
              var that = this;
      
          Module['FS_createPreloadedFile'](this.name, null, byteArray, true, true, function() {
            Module['removeRunDependency']('fp ' + that.name);
          }, function() {
            if (that.audio) {
              Module['removeRunDependency']('fp ' + that.name); // workaround for chromium bug 124926 (still no audio with this, but at least we don't hang)
            } else {
              err('Preloading file ' + that.name + ' failed');
            }
          }, false, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
  
              this.requests[this.name] = null;
            }
          };
      
              var files = metadata['files'];
              for (var i = 0; i < files.length; ++i) {
                new DataRequest(files[i]['start'], files[i]['end'], files[i]['audio'] || 0).open('GET', files[i]['filename']);
              }
      
        
      function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        
          // Reuse the bytearray from the XHR as the source for file reads.
          DataRequest.prototype.byteArray = byteArray;
    
            var files = metadata['files'];
            for (var i = 0; i < files.length; ++i) {
              DataRequest.prototype.requests[files[i].filename].onload();
            }
                Module['removeRunDependency']('datafile_../../dist/cpp11/cpp11.data');

      };
      Module['addRunDependency']('datafile_../../dist/cpp11/cpp11.data');
    
      if (!Module.preloadResults) Module.preloadResults = {};
    
        Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
        if (fetched) {
          processPackageData(fetched);
          fetched = null;
        } else {
          fetchedCallback = processPackageData;
        }
      
    }
    if (Module['calledRun']) {
      runWithFS();
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
    }
  
   }
   loadPackage({"files": [{"filename": "/usr/lib/R/library/cpp11/NAMESPACE", "start": 0, "end": 143}, {"filename": "/usr/lib/R/library/cpp11/NEWS.md", "start": 143, "end": 6894}, {"filename": "/usr/lib/R/library/cpp11/LICENSE", "start": 6894, "end": 6931}, {"filename": "/usr/lib/R/library/cpp11/DESCRIPTION", "start": 6931, "end": 8654}, {"filename": "/usr/lib/R/library/cpp11/INDEX", "start": 8654, "end": 8819}, {"filename": "/usr/lib/R/library/cpp11/html/00Index.html", "start": 8819, "end": 10555}, {"filename": "/usr/lib/R/library/cpp11/html/R.css", "start": 10555, "end": 11890}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11.hpp", "start": 11890, "end": 12550}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/r_vector.hpp", "start": 12550, "end": 38682}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/strings.hpp", "start": 38682, "end": 43724}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/integers.hpp", "start": 43724, "end": 48256}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/list.hpp", "start": 48256, "end": 51870}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/function.hpp", "start": 51870, "end": 55054}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/protect.hpp", "start": 55054, "end": 67855}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/list_of.hpp", "start": 67855, "end": 69833}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/altrep.hpp", "start": 69833, "end": 70785}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/external_pointer.hpp", "start": 70785, "end": 75001}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/named_arg.hpp", "start": 75001, "end": 76031}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/declarations.hpp", "start": 76031, "end": 77727}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/raws.hpp", "start": 77727, "end": 81795}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/doubles.hpp", "start": 81795, "end": 86050}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/R.hpp", "start": 86050, "end": 86924}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/logicals.hpp", "start": 86924, "end": 90909}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/as.hpp", "start": 90909, "end": 100762}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/attribute_proxy.hpp", "start": 100762, "end": 102064}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/r_bool.hpp", "start": 102064, "end": 104130}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/matrix.hpp", "start": 104130, "end": 110911}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/sexp.hpp", "start": 110911, "end": 113061}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/r_string.hpp", "start": 113061, "end": 115557}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/data_frame.hpp", "start": 115557, "end": 118528}, {"filename": "/usr/lib/R/library/cpp11/include/cpp11/environment.hpp", "start": 118528, "end": 120569}, {"filename": "/usr/lib/R/library/cpp11/include/fmt/core.h", "start": 120569, "end": 218811}, {"filename": "/usr/lib/R/library/cpp11/include/fmt/format.h", "start": 218811, "end": 322380}, {"filename": "/usr/lib/R/library/cpp11/include/fmt/format-inl.h", "start": 322380, "end": 426308}, {"filename": "/usr/lib/R/library/cpp11/R/cpp11", "start": 426308, "end": 427366}, {"filename": "/usr/lib/R/library/cpp11/R/cpp11.rdb", "start": 427366, "end": 459050}, {"filename": "/usr/lib/R/library/cpp11/R/cpp11.rdx", "start": 459050, "end": 459817}, {"filename": "/usr/lib/R/library/cpp11/doc/motivations.html", "start": 459817, "end": 685720}, {"filename": "/usr/lib/R/library/cpp11/doc/FAQ.Rmd", "start": 685720, "end": 692003}, {"filename": "/usr/lib/R/library/cpp11/doc/index.html", "start": 692003, "end": 695273}, {"filename": "/usr/lib/R/library/cpp11/doc/converting.Rmd", "start": 695273, "end": 705163}, {"filename": "/usr/lib/R/library/cpp11/doc/converting.html", "start": 705163, "end": 804340}, {"filename": "/usr/lib/R/library/cpp11/doc/cpp11.R", "start": 804340, "end": 810116}, {"filename": "/usr/lib/R/library/cpp11/doc/cpp11.html", "start": 810116, "end": 944904}, {"filename": "/usr/lib/R/library/cpp11/doc/FAQ.R", "start": 944904, "end": 945878}, {"filename": "/usr/lib/R/library/cpp11/doc/FAQ.html", "start": 945878, "end": 986745}, {"filename": "/usr/lib/R/library/cpp11/doc/internals.Rmd", "start": 986745, "end": 995331}, {"filename": "/usr/lib/R/library/cpp11/doc/converting.R", "start": 995331, "end": 996876}, {"filename": "/usr/lib/R/library/cpp11/doc/internals.html", "start": 996876, "end": 1019583}, {"filename": "/usr/lib/R/library/cpp11/doc/cpp11.Rmd", "start": 1019583, "end": 1061680}, {"filename": "/usr/lib/R/library/cpp11/doc/motivations.R", "start": 1061680, "end": 1067243}, {"filename": "/usr/lib/R/library/cpp11/doc/motivations.Rmd", "start": 1067243, "end": 1089080}, {"filename": "/usr/lib/R/library/cpp11/doc/internals.R", "start": 1089080, "end": 1089223}, {"filename": "/usr/lib/R/library/cpp11/Meta/features.rds", "start": 1089223, "end": 1089355}, {"filename": "/usr/lib/R/library/cpp11/Meta/package.rds", "start": 1089355, "end": 1090785}, {"filename": "/usr/lib/R/library/cpp11/Meta/links.rds", "start": 1090785, "end": 1090975}, {"filename": "/usr/lib/R/library/cpp11/Meta/nsInfo.rds", "start": 1090975, "end": 1091224}, {"filename": "/usr/lib/R/library/cpp11/Meta/Rd.rds", "start": 1091224, "end": 1091634}, {"filename": "/usr/lib/R/library/cpp11/Meta/hsearch.rds", "start": 1091634, "end": 1092070}, {"filename": "/usr/lib/R/library/cpp11/Meta/vignette.rds", "start": 1092070, "end": 1092388}, {"filename": "/usr/lib/R/library/cpp11/help/cpp11.rdb", "start": 1092388, "end": 1102638}, {"filename": "/usr/lib/R/library/cpp11/help/cpp11.rdx", "start": 1102638, "end": 1102894}, {"filename": "/usr/lib/R/library/cpp11/help/AnIndex", "start": 1102894, "end": 1103056}, {"filename": "/usr/lib/R/library/cpp11/help/aliases.rds", "start": 1103056, "end": 1103211}, {"filename": "/usr/lib/R/library/cpp11/help/paths.rds", "start": 1103211, "end": 1103392}], "remote_package_size": 1103392, "package_uuid": "889b69d6-412c-4cd6-b9ab-d43fa374ccbd"});
  
  })();
  