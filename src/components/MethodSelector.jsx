import React from 'react';

function MethodSelector({ currentMethod, onChangeMethod }) {
  return (
    <div className="method-selector">
      <h3>Métodos de Gestión:</h3>
      <div className="toggle-container-m">
        <div className="toggle-option-m">
          <input
            type="radio"
            id="static-fixed"
            name="method"
            value="static-fixed"
            checked={currentMethod === 'static-fixed'}
            onChange={() => onChangeMethod('static-fixed')}
          />
          <label htmlFor="static-fixed">Particiones Estáticas - Fijo</label>
        </div>
        <div className="toggle-option-m">
          <input
            type="radio"
            id="static-variable"
            name="method"
            value="static-variable"
            checked={currentMethod === 'static-variable'}
            onChange={() => onChangeMethod('static-variable')}
          />
          <label htmlFor="static-variable">Particiones Estáticas - Variable</label>
        </div>
        <div className="toggle-option-m">
          <input
            type="radio"
            id="dynamic-no-compact"
            name="method"
            value="dynamic-no-compact"
            checked={currentMethod === 'dynamic-no-compact'}
            onChange={() => onChangeMethod('dynamic-no-compact')}
          />
          <label htmlFor="dynamic-no-compact">Particiones Dinámicas - Sin Compactación</label>
        </div>
        <div className="toggle-option-m">
          <input
            type="radio"
            id="dynamic-compact"
            name="method"
            value="dynamic-compact"
            checked={currentMethod === 'dynamic-compact'}
            onChange={() => onChangeMethod('dynamic-compact')}
          />
          <label htmlFor="dynamic-compact">Particiones Dinámicas - Con Compactación</label>
        </div>
      </div>
    </div>
  );
}

export default MethodSelector;