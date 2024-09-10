import React from 'react';

function MemoryInfo({ memory }) {
  const usedMemory = memory.total - memory.free;
  const internalFragmentation = memory.partitions.reduce((acc, partition) => 
    acc + (partition.used > 0 && partition.used < partition.size ? partition.size - partition.used : 0), 0);

  return (
    <div className="memory-info">
      <p>Memoria Total: {memory.total} KiB ({(memory.total / 1024).toFixed(2)} MiB)</p>
      <p>Memoria Libre: {memory.free} KiB ({(memory.free / 1024).toFixed(2)} MiB)</p>
      <p>Memoria Usada: {usedMemory} KiB ({(usedMemory / 1024).toFixed(2)} MiB)</p>
      <p>Fragmentación Interna: {internalFragmentation} KiB ({(internalFragmentation / 1024).toFixed(2)} MiB)</p>
    </div>
  );
}

export default MemoryInfo;