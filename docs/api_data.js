define({ "api": [
  {
    "type": "get",
    "url": "/checkUpdate",
    "title": "Check if update exists",
    "name": "GetCheckUpdate",
    "group": "Update",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "device",
            "description": "<p>The user's device</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>The build type. Also returned in the response.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "response",
            "description": "<p>List of available updates</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "response.datetime",
            "description": "<p>Build date expressed as UNIX timestamp</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.filename",
            "description": "<p>Name of the file to be downloaded</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.id",
            "description": "<p>A string that uniquely identifies the update</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.romtype",
            "description": "<p>The release type</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.size",
            "description": "<p>Size of the update expressed in bytes</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.url",
            "description": "<p>URL of the file to be downloaded</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.version",
            "description": "<p>Version to be compared against a prop</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"response\": [\n        {\n            \"datetime\": 1551462180,\n            \"filename\": \"potato_beryllium-9-20190302.Baked-v2.1.WEEKLY.zip\",\n            \"id\": \"6f115c557c665548978795c84791c9c0\",\n            \"romtype\": \"weekly\",\n            \"size\": 528541416,\n            \"url\": \"https://mirror.potatoproject.co/beryllium/weeklies/potato_beryllium-9-20190302.Baked-v2.1.WEEKLY.zip\",\n            \"version\": \"2.1\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DeviceNotFound",
            "description": "<p>The device was not found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"DeviceNotFound\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/index.js",
    "groupTitle": "Update"
  }
] });
