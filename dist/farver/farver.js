
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
      var PACKAGE_NAME = '../../dist/farver/farver.data';
      var REMOTE_PACKAGE_BASE = 'farver.data';
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
Module['FS_createPath']("/usr/lib/R/library", "farver", true, true);
Module['FS_createPath']("/usr/lib/R/library/farver", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/farver", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/farver", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/farver", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/farver", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/farver/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/farver/farver.data');

      };
      Module['addRunDependency']('datafile_../../dist/farver/farver.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/farver/NAMESPACE", "start": 0, "end": 349}, {"filename": "/usr/lib/R/library/farver/NEWS.md", "start": 349, "end": 2054}, {"filename": "/usr/lib/R/library/farver/LICENSE", "start": 2054, "end": 2103}, {"filename": "/usr/lib/R/library/farver/DESCRIPTION", "start": 2103, "end": 3984}, {"filename": "/usr/lib/R/library/farver/INDEX", "start": 3984, "end": 4437}, {"filename": "/usr/lib/R/library/farver/html/00Index.html", "start": 4437, "end": 7567}, {"filename": "/usr/lib/R/library/farver/html/R.css", "start": 7567, "end": 8902}, {"filename": "/usr/lib/R/library/farver/R/farver", "start": 8902, "end": 9960}, {"filename": "/usr/lib/R/library/farver/R/sysdata.rdx", "start": 9960, "end": 10137}, {"filename": "/usr/lib/R/library/farver/R/farver.rdb", "start": 10137, "end": 20635}, {"filename": "/usr/lib/R/library/farver/R/farver.rdx", "start": 20635, "end": 21375}, {"filename": "/usr/lib/R/library/farver/R/sysdata.rdb", "start": 21375, "end": 26033}, {"filename": "/usr/lib/R/library/farver/Meta/features.rds", "start": 26033, "end": 26165}, {"filename": "/usr/lib/R/library/farver/Meta/package.rds", "start": 26165, "end": 27454}, {"filename": "/usr/lib/R/library/farver/Meta/links.rds", "start": 27454, "end": 27753}, {"filename": "/usr/lib/R/library/farver/Meta/nsInfo.rds", "start": 27753, "end": 28068}, {"filename": "/usr/lib/R/library/farver/Meta/Rd.rds", "start": 28068, "end": 28718}, {"filename": "/usr/lib/R/library/farver/Meta/hsearch.rds", "start": 28718, "end": 29385}, {"filename": "/usr/lib/R/library/farver/libs/farver.so", "start": 29385, "end": 2418321}, {"filename": "/usr/lib/R/library/farver/help/farver.rdb", "start": 2418321, "end": 2444451}, {"filename": "/usr/lib/R/library/farver/help/AnIndex", "start": 2444451, "end": 2444931}, {"filename": "/usr/lib/R/library/farver/help/farver.rdx", "start": 2444931, "end": 2445295}, {"filename": "/usr/lib/R/library/farver/help/aliases.rds", "start": 2445295, "end": 2445544}, {"filename": "/usr/lib/R/library/farver/help/paths.rds", "start": 2445544, "end": 2445767}, {"filename": "/usr/lib/R/library/farver/help/figures/README-unnamed-chunk-8-1.png", "start": 2445767, "end": 2470789}, {"filename": "/usr/lib/R/library/farver/help/figures/README-unnamed-chunk-7-1.png", "start": 2470789, "end": 2500331}, {"filename": "/usr/lib/R/library/farver/help/figures/logo.png", "start": 2500331, "end": 2603044}, {"filename": "/usr/lib/R/library/farver/help/figures/README-unnamed-chunk-5-1.png", "start": 2603044, "end": 2632469}, {"filename": "/usr/lib/R/library/farver/help/figures/README-unnamed-chunk-4-1.png", "start": 2632469, "end": 2655815}, {"filename": "/usr/lib/R/library/farver/help/figures/logo.svg", "start": 2655815, "end": 4028904}], "remote_package_size": 4028904, "package_uuid": "7100ed6f-e60c-4aeb-bf8f-ab3529f12d8a"});
  
  })();
  