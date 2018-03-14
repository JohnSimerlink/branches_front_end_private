import * as jsdom from 'jsdom-global';
import {GRAPH_CONTAINER_ID} from '../core/globals';
export function injectFakeDom() {
    const globalAny: any = global;
    globalAny.cleanup = jsdom(`<!doctype html><html><head><meta charset="utf-8">' +
  '</head><body><div id='${GRAPH_CONTAINER_ID}'></div></body></html>`);
    globalAny.requestAnimationFrame = () => {};
}
