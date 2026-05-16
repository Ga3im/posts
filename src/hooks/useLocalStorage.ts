export const useLocalStorage = () => {
  const setToLS = (name: string, value: unknown) => {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(name, stringValue);
  };

  const getfromLS = (name: string) => {
    const item = localStorage.getItem(name);
    if (!item) return null; // Возвращаем null, если ключа нет в LS

    try {
      return JSON.parse(item);
    } catch {
      return null; // Защита от кривых данных в LS
    }
  };

  const removeItemLS = (name: string) => {
    localStorage.removeItem(name);
  };

  return { setToLS, getfromLS, removeItemLS };
};
