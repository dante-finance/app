import { useRef } from 'react';

let uniqueId = 0;
const getUniqueId = () => uniqueId++;

export function useComponentId(): string {
  const idRef = useRef<string | null>(null);
  if (idRef.current === null) {
    idRef.current = `rrid-${getUniqueId()}`;
  }
  return idRef.current;
}
