(function (root) {
  const F = {};

  function parseList(text, name) {
    const v = String(text).trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (!v.length || v.some(x => !Number.isFinite(x) || x <= 0)) throw new Error(name + ' must be a list of positive numbers');
    return v;
  }
  F.parseList = parseList;
  F.allocate = function (blocks, procs, algo) {
    if (!['first', 'best', 'worst'].includes(algo)) throw new Error('Algorithm must be first, best or worst');
    if (blocks.some(x => !Number.isFinite(x) || x <= 0) || procs.some(x => !Number.isFinite(x) || x <= 0)) throw new Error('Block and process sizes must be positive numbers');
    let addr = 0;
    const free = blocks.map(size => { const h = {size, addr}; addr += size; return h; });
    const placements = [];
    const leftover = [];
    const log = [];
    for (let p = 0; p < procs.length; p++) {
      const need = procs[p];
      const cands = free.map((h, i) => ({i, size: h.size, addr: h.addr})).filter(h => h.size >= need);
      if (!cands.length) {
        leftover.push({id: p, size: need});
        log.push('P' + (p + 1) + ' (' + need + '): no hole is large enough');
        continue;
      }
      let pick = cands[0];
      if (algo === 'best') pick = cands.reduce((a, b) => a.size < b.size ? a : a.size === b.size && a.addr < b.addr ? a : b);
      if (algo === 'worst') pick = cands.reduce((a, b) => a.size > b.size ? a : a.size === b.size && a.addr < b.addr ? a : b);
      const hole = free[pick.i];
      const at = hole.addr;
      const rem = hole.size - need;
      if (rem > 0) { hole.size = remnant(rem); hole.addr = at + need; }
      else free.splice(pick.i, 1);
      placements.push({id: p, size: need, addr: at, rem: rem});
      log.push('P' + (p + 1) + ' (' + need + ') placed at ' + at + ', leftover in that hole = ' + rem);
    }
    function remnant(x) { return x; }
    const freeSum = free.reduce((s, h) => s + h.size, 0);
    const ext = leftover.some(x => freeSum >= x.size);
    return {placements, leftover, free: free.map(h => ({size: h.size, addr: h.addr})), freeSum, ext, log, algo};
  };
  F.format = function (r, blocks, procs) {
    const name = {first: 'First Fit', best: 'Best Fit', worst: 'Worst Fit'}[r.algo];
    let out = name + ' (variable / dynamic partitions, holes kept in address order)\n';
    out += 'Initial holes: ' + blocks.map((s, i) => s + ' (starts at ' + blocks.slice(0, i).reduce((a, b) => a + b, 0) + ')').join(', ') + '\n';
    out += r.log.join('\n') + '\n';
    if (r.placements.length) {
      out += '\nPlaced:\n' + r.placements.map(p => 'P' + (p.id + 1) + ' size ' + p.size + ' at address ' + p.addr).join('\n') + '\n';
    }
    if (r.leftover.length) out += '\nNot placed: ' + r.leftover.map(p => 'P' + (p.id + 1) + ' (' + p.size + ')').join(', ') + '\n';
    else out += '\nEvery process was placed.\n';
    out += 'Remaining holes: ' + (r.free.length ? r.free.map(h => h.size + ' at ' + h.addr).join(', ') : 'none') + ' (sum ' + r.freeSum + ')\n';
    if (r.ext) out += 'External fragmentation: yes. A waiting process would fit in the free total, but no single hole is large enough.\n';
    else if (r.leftover.length) out += 'The waiting process is larger than the total free memory, so this is not only a fragmentation issue.\n';
    else out += 'No process is waiting, so this snapshot has no failed allocation from external fragmentation.\n';
    return out;
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = F;
  else root.F = F;
})(typeof globalThis !== 'undefined' ? globalThis : this);
