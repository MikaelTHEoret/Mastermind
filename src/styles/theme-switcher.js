
export function switchTheme(themeName) {
  const themePath = themes[themeName];
  if (!themePath) {
    console.error(`Theme "${themeName}" does not exist.`);
    return;
  }

  // Remove the existing theme link element, if any
  const existingLink = document.getElementById('dynamic-theme');
  if (existingLink) {
    existingLink.remove();
  }

  // Create a new link element for the selected theme
  const link = document.createElement('link');
  link.id = 'dynamic-theme';
  link.rel = 'stylesheet';
  link.href = themePath;
  document.head.appendChild(link);

  console.log(`Switched to theme: ${themeName}`);
}
