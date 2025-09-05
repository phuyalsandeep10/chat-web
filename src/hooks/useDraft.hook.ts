import React, { useEffect, useState } from 'react';

const useDraftHook = ({ labelKey }: { labelKey: string }) => {
  const [value, setValue] = useState<string>(
    localStorage.getItem(labelKey) || '',
  );
  useEffect(() => {
    localStorage.setItem(labelKey, value);
  }, [value]);
  const onSave = (message: string) => {
    setValue(message);
  };
  const onClear = () => {
    localStorage.removeItem(labelKey);
  };

  return {
    value,
    onSave,
    onClear,
  };
};
