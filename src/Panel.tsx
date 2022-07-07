import React from 'react';

export const Panel = ({ active }: { active: boolean }) => {
  return active ? <p>Drupal Panel</p> : <></>;
};
