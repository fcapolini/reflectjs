import { assert } from "chai";
import express from 'express';
import * as happy from 'happy-dom';
import { Server } from 'http';
import { JSDOM } from 'jsdom';

const rootPath = process.cwd() + '/test/server/jsdom';

/**
 * we're only using jsdom for testing
 */

describe('server: jsdom', () => {
  let server: Server;
  let port: number;

  before(async () => {
    const app = express();
    app.use(express.static(rootPath));
    return new Promise(resolve => {
      server = app.listen(() => {
        port = (server.address() as any).port;
        resolve();
      });
    });
  });

  after(() => {
    server.close();
  });

  it(`should execute example`, () => {
    // https://github.com/jsdom/jsdom
    const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
    assert.equal(
      dom.window?.document?.querySelector("p")?.textContent,
      'Hello world'
    );
  });

  it(`should execute scripts`, () => {
    const dom = new JSDOM(`<p></p><script>
      document.querySelector("p").innerHTML = 'Hi there';
    </script>`, { runScripts: "dangerously" });
    assert.equal(
      dom.window?.document?.querySelector("p")?.textContent,
      'Hi there'
    );
  });

  it(`should load page1.html (static)`, async () => {
    const doc = await loadPage(`http://localhost:${port}/page1.html`);
    assert.equal(
      doc.body.textContent?.trim(),
      'page1 text'
    );
  });

  it(`should load page2.html (dynamic)`, async () => {
    const doc = await loadPage(`http://localhost:${port}/page2.html`);
    assert.equal(
      doc.body.textContent?.trim(),
      'page2 text'
    );
  });

});

export async function loadPage(url: string) {
  // we're using happy-dom for its `fetch` implementation
  const win = new happy.Window();
  const text = await (await win.fetch(url)).text();
  // but we're returning a jsdom document because it does execute page scripts
  const dom = new JSDOM(text, { runScripts: "dangerously" });
  return dom.window.document;
}
