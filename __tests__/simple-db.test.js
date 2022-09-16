const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const simpleDb = require('../lib/simple-db');


const { CI, HOME } = process.env;
const BASE_DIR = CI ? HOME : __dirname;
const TEST_DIR = path.join(BASE_DIR, 'test-dir');

describe('simple database', () => {

  beforeEach(async () => {
    await fs.rm(TEST_DIR, { force: true, recursive: true });
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  it('gets by ID', async () => {
    const soda = {
      name: 'mellow yellow', 
    };
    const id = crypto.randomBytes(1).toString('hex');
    await fs.writeFile(`${TEST_DIR}/${id}.json`, JSON.stringify(soda));
    const data = new simpleDb(TEST_DIR);
    const result = await data.getById(id);
    expect(result).toEqual(soda);
  });



  

});
