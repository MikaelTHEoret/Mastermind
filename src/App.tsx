import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Visualizer from './components/Visualizer';
import NetworkMonitor from './components/NetworkMonitor';
import Settings from './components/Settings';
import { useNexusStore } from './stores/nexusStore';
import { useWindowStore } from './stores/windowStore';

function App() {
  const { initialize } = useNexusStore();
  const { addWindow } = useWindowStore();

  React.useEffect(() => {
    // Initialize the Nexus system
    initialize();

    // Open Johnny window by default
    addWindow({
      id: 'johnny',
      title: 'Johnny Go Getter',
      type: 'johnny',
      component: 'JohnnyWindow',
      position: { x: 150, y: 150 },
      size: { width: 700, height: 500 },
      isMinimized: false,
      isMaximized: false,
    });

    // Open Sir Executor in minimized state
    addWindow({
      id: 'executor',
      title: 'Sir Executor',
      type: 'executor',
      component: 'ExecutorWindow',
      position: { x: 200, y: 200 },
      size: { width: 400, height: 300 },
      isMinimized: true,
      isMaximized: false,
    });
  }, [initialize, addWindow]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="visualizer" element={<Visualizer />} />
          <Route path="network" element={<NetworkMonitor />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;