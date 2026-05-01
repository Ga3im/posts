import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Main } from "./pages/MainPage";
import { Provider } from "react-redux";
import store from "./store";
import { PostPage } from "./pages/PostPage";
import { routes } from "./pages/routes";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path={routes.main} element={<Main />}>
            <Route path={routes.post} element={<PostPage />} />
          </Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
