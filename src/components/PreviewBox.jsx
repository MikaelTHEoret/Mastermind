
import React from 'react';

const PreviewBox = ({ theme }) => {
  const previewImage =
    theme === 'galacticPulse' ? '/assets/images/galactic-preview.png' : '/assets/images/serene-preview.png';

  return (
    <div className="preview-box">
      <img src={previewImage} alt={`${theme} preview`} />
    </div>
  );
};

export default PreviewBox;
