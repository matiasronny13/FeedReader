import './styles/App.scss'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import { Suspense, lazy } from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Box } from '@mui/material';

const queryClient = new QueryClient();
const Home = lazy(() => import("./pages/home/Home"));

function App() {
  const Layout = () => {
    return (
    <Box flexGrow={1}>
      <Grid container minHeight={"100vh"} flexDirection={"column"}>
        <Grid xs={12}>
          <Navbar/>
        </Grid>
        <Grid xs={12} flexGrow={1} display={"flex"} flexDirection={"column"}>
          <QueryClientProvider client={queryClient}>
            <Outlet />
          </QueryClientProvider>
        </Grid>
        <Grid xs={12}>
          <Footer/>
        </Grid>
      </Grid>        
    </Box>);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: (<Suspense fallback={<>Loading...</>}><Home /></Suspense>)
        }
      ],
    }
  ], { basename: import.meta.env.BASE_URL });

  return <RouterProvider router={router} />;
}

export default App;