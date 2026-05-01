export const useSaveLS = () => {
  const setToLS = (name: string, value: any) => {
    JSON.stringify(localStorage.setItem(`${name}`, value));
  };

  const getfromLS = (name: string) => {
    return JSON.parse(localStorage.getItem(name));
  };

  const removeItemLS = (name: string) => {
    localStorage.removeItem(name);
  };
  return { setToLS, getfromLS, removeItemLS };
};
