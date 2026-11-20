# GTU OS 3140702 memory allocation: First Fit, Best Fit and Worst Fit, plus external fragmentation

GTU Hero's OS guide puts Memory Management as Unit 6, 15% of 3140702, and notes that internal vs external fragmentation repeated as theory in W2022 Q4(b) and W2024 Q3(b). It also flags that W2024 Q4's OR swapped from scheduling to memory allocation, so this numerical is worth practising. Hole sizes aur process sizes daalo: this page places each process by First Fit, Best Fit or Worst Fit (variable partitions) and tells you if a failed allocation is external fragmentation. Practice values are my own, not from a GTU paper.

Live page: https://princeadvant.github.io/gtu-os-memory-fit-allocator/

## Facts used

- First Fit: scan holes from the start of memory and take the first hole that is large enough.
- Best Fit: take the smallest hole that is large enough. Worst Fit: take the largest hole.
- This tool uses variable (dynamic) partitions: a leftover piece of a hole stays as a new hole. That leftover is not internal fragmentation.
- Internal fragmentation is leftover space inside a fixed partition that no other process can use. External fragmentation is when free space exists in total, but it is split so no hole is large enough.
- Default practice set: holes 100, 500, 200, 300, 600 and processes 212, 417, 112, 426. First Fit and Worst Fit cannot place 426 (external fragmentation). Best Fit places all four.

## Test

`node test.js` checks the calculations against hand-worked values and prints `All checks passed`.

## Tips

- Say which placement rule you used, and show the hole list after every allocation, not only the last total.
- If a process cannot be placed, add up the remaining holes. If the sum is large enough, write 'external fragmentation'.
- Do not mix this numerical with page replacement (FIFO, LRU, Optimal). That is a different Unit 6 question, with frames and a reference string.
- Compaction is one way to fix external fragmentation. Fixed partitions trade that for internal fragmentation.

Repeat table, unit weights and the 7-day OS plan: [GTU Hero](https://gtuhero.com/blogs/gtu-os-paper-operating-system-pyq) (GTU Hero is my project).
