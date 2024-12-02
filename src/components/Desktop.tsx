
import React, { useState } from 'react';
import Window from './Window';
import Taskbar from './Taskbar';

const Desktop = () => {
  const [windows, setWindows] = useState([
    { id: 1, title: 'System Monitor', content: 'Monitoring...', x: 100, y: 100 },
    { id: 2, title: 'Task Manager', content: 'Task details...', x: 300, y: 150 },
  ]);
  const [activeWindow, setActiveWindow] = useState(null);

  const moveWindow = (id, x, y) => {
    setWindows((prev) =>
      prev.map((win) =>
        win.id === id ? { ...win, x: x, y: y } : win
      )
    );
  };

  const switchWindow = (id) => {
    setActiveWindow(id);
  };

  return (
    <div className="desktop">
      {windows.map((win) => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          content={win.content}
          x={win.x}
          y={win.y}
          isActive={activeWindow === win.id}
          onMove={moveWindow}
        />
      ))}
      <Taskbar windows={windows} onSwitch={switchWindow} />
    </div>
  );
};

export default Desktop;
