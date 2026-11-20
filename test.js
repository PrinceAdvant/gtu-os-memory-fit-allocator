const F = require('./calc.js');
const eq = (x, y, msg) => {
  if (JSON.stringify(x) !== JSON.stringify(y)) throw Error((msg ? msg + ': ' : '') + JSON.stringify(x) + ' vs ' + JSON.stringify(y));
};
const blocks = [100, 500, 200, 300, 600];
const procs = [212, 417, 112, 426];

const ff = F.allocate(blocks, procs, 'first');
eq(ff.placements.map(p => [p.id, p.size, p.addr, p.rem]), [[0,212,100,288],[1,417,1100,183],[2,112,312,176]], 'ff placed');
eq(ff.leftover, [{id:3,size:426}], 'ff leftover');
eq(ff.ext, true, 'ff ext frag');
eq(ff.freeSum, 100+176+200+300+183, 'ff free');

const bf = F.allocate(blocks, procs, 'best');
eq(bf.placements.map(p => [p.id, p.size, p.addr]), [[0,212,800],[1,417,100],[2,112,600],[3,426,1100]], 'bf placed');
eq(bf.leftover, [], 'bf leftover');
eq(bf.ext, false, 'bf no failed alloc');

const wf = F.allocate(blocks, procs, 'worst');
eq(wf.placements.map(p => [p.id, p.size, p.addr]), [[0,212,1100],[1,417,100],[2,112,1312]], 'wf placed');
eq(wf.leftover, [{id:3,size:426}], 'wf leftover');
eq(wf.ext, true, 'wf ext frag');

const throws = (fn) => { try { fn(); } catch (e) { return; } throw Error('expected an error'); };
throws(() => F.parseList('-10', 'Blocks'));
throws(() => F.allocate([-10], [1], 'first'));
throws(() => F.allocate([100], [10], 'maybe'));

console.log('All checks passed');
