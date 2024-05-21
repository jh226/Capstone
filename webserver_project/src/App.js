import { BrowserRouter as HashRouter, Routes, Route } from "react-router-dom";
import ThemeRoutes from "./routes/Router";
import { AuthProvider } from "./Login.Status";
function App() {
  return (
    <AuthProvider>
      <div className="dark">
        <HashRouter>
          <Routes>
            <Route path="/" element={ThemeRoutes[0].layout}>
              {ThemeRoutes[0].children[0]}
              {ThemeRoutes[0].children[1]}
              {ThemeRoutes[0].children[2]}
              {ThemeRoutes[0].children[3]}
              {ThemeRoutes[0].children[4]}
              {ThemeRoutes[0].children[5]}
            </Route>
          </Routes>
        </HashRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
