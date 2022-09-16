const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const { Z_PARTIAL_FLUSH } = require('zlib');
const { stat } = require('fs');


class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }

  getById(id) {
    this.filePath = path.join(this.dirPath, `${id}.json`);
    return fs
      .readFile(this.filePath)
      .then((file) => JSON.parse(file))
      .catch((error) => {
        if (error.code === 'ENOENT') {
          throw new Error(`bad file: ${this.filePath}`);
        }
        throw error;
      });
  }


  save(plane) {
    plane.id = crypto.randomBytes(1).toString('hex');
    const data = JSON.stringify(plane);
    return fs.writeFile(`${this.dirPath}/${plane.id}.json`, data);
  }




  getAll() {
    return fs.readdir(this.dirPath).then((paths) => {
      const promises = paths.map((path) => {
        return fs.lstat(`${this.dirPath}/${path}`).then((stat) => {
          if (stat.isDirectory()) {
            return '';
          } else {
            const id = path.replace('.json', '');
            return this.getById(id);
          }
        });
      });
      return Promise.all(promises);  
    });
  }





}

module.exports = SimpleDb;
