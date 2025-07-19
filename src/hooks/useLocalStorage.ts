import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State, um den aktuellen Wert zu halten.
  // Die Initialisierung erfolgt über eine Funktion, damit der teure localStorage-Zugriff nur einmal zu Beginn stattfindet.
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Wert aus dem LocalStorage anhand des Keys holen.
      const item = window.localStorage.getItem(key);
      // Den gespeicherten JSON-String parsen oder, falls nichts vorhanden, den initialValue verwenden.
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Bei einem Fehler den initialValue zurückgeben und den Fehler loggen.
      console.error(error);
      return initialValue;
    }
  });

  // Eine eigene Setter-Funktion, die den Wert sowohl im State als auch im LocalStorage aktualisiert.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Ermöglicht das Setzen eines Wertes oder die Verwendung einer Funktion wie bei useState.
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Den neuen Wert im State speichern.
      setStoredValue(valueToStore);
      // Den neuen Wert als JSON-String im LocalStorage speichern.
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}