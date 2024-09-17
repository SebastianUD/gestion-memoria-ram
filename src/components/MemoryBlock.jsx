import React from 'react';

function MemoryBlock({ memory, currentMethod }) {
  const getPartitionColor = (partition) => {
    if (!partition.program) return '#29652C'; // Verde para particiones libres
    switch (partition.program.state) {
      case 'active': return '#B50000'; // Rojo para programas activos
      case 'suspended': return '#757575'; // Gris para programas suspendidos
      default: return '#B50000'; // Verde para particiones liberadas (terminadas)
    }
  };

  const isStaticMethod = currentMethod === 'static-fixed' || currentMethod === 'static-variable';

  const renderPartitions = () => {
    const totalSize = memory.partitions.reduce((sum, partition) => sum + partition.size, 0);

    return (
      <div className="memory-block">
        {memory.partitions.map((partition, index) => (
          <div 
            key={index} 
            className="partition" 
            style={{ flex: partition.size / totalSize }}
          >
            <div 
              className="partition-used" 
              style={{ 
                width: isStaticMethod 
                  ? `${(partition.used / partition.size) * 100}%`
                  : partition.program && partition.program.state !== 'terminated' ? '100%' : '0%',
                backgroundColor: getPartitionColor(partition)
              }}
            >
              {partition.program && partition.program.state !== 'terminated' ? `${partition.program.label} - ${partition.used} KiB` : ''}
            </div>
            <div 
              className="partition-free" 
              style={{ 
                width: isStaticMethod 
                  ? `${((partition.size - partition.used) / partition.size) * 100}%`
                  : partition.program && partition.program.state !== 'terminated' ? '0%' : '100%'
              }}
            >
              {partition.used === 0 || (partition.program && partition.program.state === 'terminated')
                ? `Libre ${partition.size} KiB` 
                : isStaticMethod ? `${partition.size - partition.used} KiB libre` : ''}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return renderPartitions();
}

export default MemoryBlock;