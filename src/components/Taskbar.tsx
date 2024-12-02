
import React from 'react';

const Taskbar = ({ windows, onSwitch }) => {
  return (
    <div className="taskbar">
      {windows.map((win) => (
        <button key={win.id} onClick={() => onSwitch(win.id)}>
          {win.title}
        </button>
      ))}
    </div>
  );
};

export default Taskbar;
