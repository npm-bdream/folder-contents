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
* `extSep` : **' . '** (extention separator 'toto.jpg')
* `extIgnore` : **[ ]** (list of extentions to ignore ['jpg',...], is case insensitive)
* `extAccept` : **[ ]** (list of extentions to accept ['mkv',...], is case insensitive )
* `folderIgnore` : **[ ]** (list of folder to ignore ['.svn',...], is case sensitive )
* `fileIgnore` : **[ ]** (list of file to ignore ['toto',...] for 'toto.jpg', , is case sensitive )
* `sizeFormatting` : **false** (Easy reading by the user but approximate value. If `false`, return real value in bytes)
* `sizeI18n` : (If you want translate byte unit) Five units are needed if used.

        {
            "b":"b",
            "kb":"kb",
            "mb":"mb",
            "gb":"gb",
            "tb":"tb"
        }

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

**Example 03 : exclude mkv extention and translate byte unit for french customers**

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


**Where :**

* `path` : parent folder of file.
* `name` : file name (without extention).
* `ext` : file extention.
* `size` : file size.


Versions
=========

**v 0.0.8 - 2014/06/06**

* Add byte unit translation.
* `extIgnore` is now case insensitive.
* `extAccept` is now case insensitive.

**v 0.0.6 - 2014/06/06**

* sire is now displayable, using package bytes-i18n

**v 0.0.5 - 2014/06/05**

* Add size in result.