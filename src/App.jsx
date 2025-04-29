import { Fragment } from 'react'
import { publicRoutes } from './routes/publicRoutes';
import { DefaultLayout } from './layouts/DefaultLayout/DefaultLayout';
import { BrowserRouter, Route, Routes } from 'react-router';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map((route, i) => {
          const Page = route.component;
          let Layout = DefaultLayout;
          if (route.layout) {
            Layout = route.layout;
          } else if (route.layout === null) {
            Layout = Fragment;
          }
          return (
            <Route
              key={i}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App
