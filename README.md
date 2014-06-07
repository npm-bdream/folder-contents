[![NPM](https://nodei.co/npm/folder-contents.png?downloads=true&stars=true)](https://nodei.co/npm/folder-contents/)

**folder-contents**
===================

Get list of files recursively in the specified folder with options

**Usage**
=========

    var fcs = require('folder-contents');

    var options = {
        "path":"./your-folder-name",
        "extSep":".",
        "extIgnore":[],
        "extAccept":[],
        "folderIgnore":[],
        "fileIgnore":[],
        "sizeFormatting":false,
        "sizeI18n":{
            "b":"b",
            "kb":"kb",
            "mb":"mb",
            "gb":"gb",
            "tb":"tb"
        }
    };
    var jsonFileList = fcs.getFilesList(options);
    console.log(jsonFileList);


**defaults :**
* `path` : **' . '** (folder where we want to list files . is equal to ./ )
* `extSep` : **' . '** (extension separator 'toto.jpg')
* `resultJsonStruct` : **'list'**
    * `list` : build simple json list with files.(fast)
    * `ext` : build list by extension.(fast)
    * `path` : build complex list based on path (More operations)
* `extIgnore` : **[ ]** (list of extension to ignore ['jpg',...], is case insensitive)
* `extAccept` : **[ ]** (list of extension to accept ['mkv',...], is case insensitive )
* `folderIgnore` : **[ ]** (list of folder to ignore ['.svn',...], is case sensitive )
* `fileIgnore` : **[ ]** (list of file to ignore ['toto',...] for 'toto.jpg', , is case sensitive )
* `fullPath` : **false** (if enabled, result contain `fpath`. Is full file path )
* `dates` : **false** (if enabled, result contain timestamp for `atime`,`ctime` and `mtime`)
* `dateFormat` : (format `atime`/`ctime`/`mtime` instead of timestamp)
    * See [npm dateformat package][1] for patterns, can be "yyyy/mm/dd - HH:MM:ss" for example
* `sizeFormatting` : **false** (Easy reading by the user but approximate value. If `false`, return real value in bytes)
* `sizeI18n` : (If you want translate byte unit) Five units are needed to define if used :
    * `b` `kb` `mb` `gb` `tb`

       

If `extAccept` is used, `extIgnore` content is ignored.

**Example 01 : simple usage**

    var options = {
        "path":"./test"
    };
    var jsonFileList = fcs.getFilesList(options);
    console.log(jsonFileList);

    // Log result :
    [
        { path: './test/', name: '', ext: 'htaccess', size: 421 },
        { path: './test/', name: 'index', ext: 'html', size: 1422 },
        { path: './test/', name: 'manifest', ext: 'plist', size: 726 },
        { path: './test/', name: 'noExtFile', ext: '', size: 0 },
        { path: './test/', name: 'release', ext: 'docx', size: 17233 },
        { path: './test/subfolder/', name: 'film.vostvo.team-yo', ext: 'mkv', size: 703836104 },
        { path: './test/', name: 'toto', ext: 'JPG', size: 2760113 }
    ]

**Example 02 : format file size**

    var options = {
        "path":"./test",
        "sizeFormatting":true
    };
    var jsonFileList = fcs.getFilesList(options);
    console.log(jsonFileList);

    // Log result :
    [
        { path: './test/', name: '', ext: 'htaccess', size: '421b' },
        { path: './test/', name: 'index', ext: 'html', size: '1.39kb' },
        { path: './test/', name: 'manifest', ext: 'plist', size: '726b' },
        { path: './test/', name: 'noExtFile', ext: '', size: '0b' },
        { path: './test/', name: 'release', ext: 'docx', size: '16.83kb' },
        { path: './test/subfolder/', name: 'film.vostvo.team-yo', ext: 'mkv', size: '671.23mb' },
        { path: './test/', name: 'toto', ext: 'JPG', size: '2.63mb' }
    ]

**Example 03 : Allow full path and dates, we choose date format**

    var options = {
        "path":"./test",
        "sizeFormatting":true
        "fullPath":true,
        "dates":true,
        "extAccept":["mkv"],
        "dateFormat":"yyyy/mm/dd - HH:MM:ss"
    };
    var jsonFileList = fcs.getFilesList(options);
    console.log(jsonFileList);

    // Log result :
    [ 
        {   
            path: './test/subfolder/',
            name: 'film.vostvo.team-yo',
            ext: 'mkv',
            size: '85b',
            fpath: './test/subfolder/film.vostvo.team-yo.mkv',
            atime: '2014/06/07 - 23:54:11',
            mtime: '2014/06/07 - 23:54:11',
            ctime: '2014/06/06 - 23:06:35' 
        } 
    ]

**Example 04 : exclude mkv extension and translate byte unit for french customers**

    var options = {
        "path":"./test",
        "sizeFormatting":true,
        "extIgnore":["mKV"],
        "sizeI18n":{
            "b":" o",
            "kb":" ko",
            "mb":" mo",
            "gb":" go",
            "tb":" to"
        }
    };
    var jsonFileList = fcs.getFilesList(options);
    console.log(jsonFileList);

    // Log result :
    [
        { path: './test/', name: '', ext: 'htaccess', size: '421 o' },
        { path: './test/', name: 'index', ext: 'html', size: '1.39 ko' },
        { path: './test/', name: 'manifest', ext: 'plist', size: '726 o' },
        { path: './test/', name: 'noExtFile', ext: '', size: '0 o' },
        { path: './test/', name: 'release', ext: 'docx', size: '16.83 ko' },
        { path: './test/', name: 'toto', ext: 'JPG', size: '2.63 mo' }
    ]

**Example 05 : use resultJsonStruct `path`**

    var options = {
        "path":"./test",
        "resultJsonStruct":"path"
    };
    var jsonFileList = fcs.getFilesList(options);
    console.log(JSON.stringify(jsonFileList));

    // Log result :
    {
        ".": {
            "test": {
                ".files": [
                    {
                        "path": "./test/",
                        "name": "",
                        "ext": "htaccess",
                        "size": 421
                    },
                    {
                        "path": "./test/",
                        "name": "index",
                        "ext": "html",
                        "size": 1422
                    },
                    {
                        "path": "./test/",
                        "name": "manifest",
                        "ext": "plist",
                        "size": 726
                    },
                    {
                        "path": "./test/",
                        "name": "noExtFile",
                        "ext": "",
                        "size": 0
                    },
                    {
                        "path": "./test/",
                        "name": "release",
                        "ext": "docx",
                        "size": 17233
                    },
                    {
                        "path": "./test/",
                        "name": "toto",
                        "ext": "JPG",
                        "size": 2760113
                    }
                ],
                "subfolder": {
                    ".files": [
                        {
                            "path": "./test/subfolder/",
                            "name": "film.vostvo.team-yo",
                            "ext": "mkv",
                            "size": 703836104
                        }
                    ]
                }
            }
        }
    }

    console.log(JSON.stringify(jsonFileList['.']['test']['subfolder']['.files']));

    // Log result :

    [
        {
            "path": "./test/subfolder/",
            "name": "film.vostvo.team-yo",
            "ext": "mkv",
            "size": 703836104
        }
    ]


**Example 06 : use resultJsonStruct `ext`**

    var options = {
        "path":"./test",
        "resultJsonStruct":"ext",
        "extIgnore":["jpg"]
    };
    var jsonFileList = fcs.getFilesList(options);
    console.log(JSON.stringify(jsonFileList));

    // Log result :
    {
        "htaccess": [
            {
                "path": "./test/",
                "name": "",
                "ext": "htaccess",
                "size": 421
            }
        ],
        "html": [
            {
                "path": "./test/",
                "name": "index",
                "ext": "html",
                "size": 1422
            }
        ],
        "plist": [
            {
                "path": "./test/",
                "name": "manifest",
                "ext": "plist",
                "size": 726
            }
        ],
        "": [
            {
                "path": "./test/",
                "name": "noExtFile",
                "ext": "",
                "size": 0
            }
        ],
        "docx": [
            {
                "path": "./test/",
                "name": "release",
                "ext": "docx",
                "size": 17233
            }
        ],
        "mkv": [
            {
                "path": "./test/subfolder/",
                "name": "film.vostvo.team-yo",
                "ext": "mkv",
                "size": 703836104
            }
        ]
    }

**Where in file result :**

* `path` : parent folder of file.
* `name` : file name (without extension).
* `ext` : file extension.
* `size` : file size.
* `fpath` : parent folder, full file name and extension.
* `atime` : see [Linux info page][2]
* `ctime` : see [Linux info page][2]
* `mtime` : see [Linux info page][2]


Versions
=========

**v 0.1.0 - 2014/06/08**

* Add file dates : atime, ctime, mtime (timestamp).
* Date added if `dates` option is enabled.
* Date is formatted if `dateFormat` option is configured.
* Add file full path : fpath, enabled if `fullPath` option is enabled.

**v 0.0.9 - 2014/06/07**

* Add resultJsonStruct option.
* Optimizing options initialization.

**v 0.0.8 - 2014/06/06**

* Add byte unit translation.
* `extIgnore` is now case insensitive.
* `extAccept` is now case insensitive.

**v 0.0.6 - 2014/06/06**

* Size is now displayable, using package bytes-i18n

**v 0.0.5 - 2014/06/05**

* Add size in result.


  [1]: https://www.npmjs.org/package/dateformat
  [2]: http://www.linux-faqs.info/general/difference-between-mtime-ctime-and-atime