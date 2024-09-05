import React from 'react';

function MemoryInfo({ memory }) {
  return (
    <div className="memory-info">
      <p>Memoria Total: {memory.total} KiB ({(memory.total / 1024).toFixed(2)} MiB)</p>
      <p>Memoria Libre: {memory.free} KiB ({(memory.free / 1024).toFixed(2)} MiB)</p>
      <p>Memoria Usada: {memory.total - memory.free} KiB ({((memory.total - memory.free) / 1024).toFixed(2)} MiB)</p>
    </div>
  );
}

export default MemoryInfo;