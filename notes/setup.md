# Project setup

```bash
npm init -y
npm i -D typescript
npx tsc --init
mkdir dist
mkdir src
mkdir test
```

tsconfig.json:

```json
  "compilerOptions": {
    ...
    "target": "es5",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    ...
```

.gitignore:

```
node_modules
.nyc_output
coverage
dist
```

src/index.ts:

```typescript
console.log('index.ts');
```

## Testing & Coverage

```bash
npm i -D mocha chai ts-node
npm i -D @types/mocha @types/chai
npm i -D nyc
```

package.json:

```json
{
  ...
  "scripts": {
    "test": "mocha --exit -r ts-node/register test/**/*.test.ts",
    "coverage": "nyc npm run test"
  }
  ...
```

tsconfig.json:

```json
{
  "include": ["src/**/*"], // don't include ./test/ dir
  ...
```

test/dummy.test.ts:

```typescript
import { assert } from "chai";

describe('dummy', function () {

  it("should succeed", () => {
    assert.isTrue(true);
  });

});
```

### Speedup

```bash
npm i -D @swc/core
# this became needed later on when testing preprocessor w/ fs/promises file access
npm i -D regenerator-runtime
```

tsconfig.json:

```json
{
  ...
  "ts-node": {
    "transpileOnly": true,
    "transpiler": "ts-node/transpilers/swc-experimental"
  },
  ...
```

### Server-side DOM

```bash
npm install happy-dom
```

- [happy-dom](https://github.com/capricorn86/happy-dom)
- [happy-dom usage](https://github.com/capricorn86/happy-dom/tree/master/packages/happy-dom#usage)

test/happy-dom.test.ts:

```typescript
import { assert } from "chai";
import { Window } from 'happy-dom';

describe('happy-dom', function () {

  it("should execute example", () => {
    const window = new Window();
    const document = window.document;
    document.body.innerHTML = '<div class="container"></div>';
    const container = document.querySelector('.container');
    const button = document.createElement('button');
    container.appendChild(button);
    assert.equal(
        document.body.innerHTML,
        `<div class="container"><button></button></div>`
    );
  });

});
```