export const useLocalStorage = () => {
  const setToLS = (name: string, value: any) => {
    console.log("SETTING TO LS:", name, value);
    const stringValue = JSON.stringify(value);
    localStorage.setItem(name, stringValue);
  };

  const getfromLS = (name: string) => {
    return JSON.parse(localStorage.getItem(name));
  };

  const removeItemLS = (name: string) => {
    localStorage.removeItem(name);
  };
  return { setToLS, getfromLS, removeItemLS };
};
