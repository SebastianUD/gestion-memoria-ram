// MemoryInfo.jsx
import React from 'react';

function MemoryInfo({ memory }) {
  const usedMemory = memory.total - memory.free;
  const totalMiB = (memory.total / 1024).toFixed(2);
  const freeMiB = (memory.free / 1024).toFixed(2);
  const usedMiB = (usedMemory / 1024).toFixed(2);

  const internalFragmentation = memory.partitions.reduce((acc, partition) => 
    acc + (partition.used > 0 && partition.used < partition.size ? partition.size - partition.used : 0), 0);
  const fragmentationMiB = (internalFragmentation / 1024).toFixed(2);

  return (
    <div className="memory-info">
      <p>Memoria Total: {memory.total} KiB ({totalMiB} MiB)</p>
      <p>Memoria Libre: {memory.free} KiB ({freeMiB} MiB)</p>
      <p>Memoria Usada: {usedMemory} KiB ({usedMiB} MiB)</p>
      <p>Fragmentación Interna: {internalFragmentation} KiB ({fragmentationMiB} MiB)</p>
    </div>
  );
}

export default MemoryInfo;