import React from 'react';

function MemoryBlock({ memory, currentMethod }) {
  const renderPartitions = () => {
    if (currentMethod === "static-fixed" || currentMethod === "static-variable") {
      return (
        <div className="memory-block">
          {memory.partitions.map((partition, index) => (
            <div key={index} className="partition">
              <div 
                className="partition-used" 
                style={{ width: `${(partition.used / partition.size) * 100}%` }}
              >
                {partition.program ? `${partition.program.label} - ${partition.used} KiB` : ''}
              </div>
              <div 
                className="partition-free" 
                style={{ width: `${((partition.size - partition.used) / partition.size) * 100}%` }}
              >
                {partition.used === 0 ? `Libre ${partition.size} KiB` : `${partition.size - partition.used} KiB libre`}
              </div>
            </div>
          ))}
        </div>
      );
    } else if (currentMethod === "dynamic-no-compact" || currentMethod === "dynamic-compact") {
      return (
        <div className="memory-block">
          {memory.partitions.map((partition, index) => (
            <div key={index} className="partition">
              <div 
                className="partition-used" 
                style={{ width: `${(partition.used) * 100}%` }}
              >
                {partition.program ? `${partition.program.label} - ${partition.used} KiB` : ''}
              </div>
              <div 
                className="partition-free" 
                style={{ width: `${(1 - partition.used) * 100}%` }}
              >
                {partition.used === 0 ? `Libre ${memory.free} KiB` : `${memory.free} KiB libre`}
              </div>
            </div>
          ))}
        </div>
      );
    }
  }
  return renderPartitions();
}

export default MemoryBlock;