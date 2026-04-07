import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout';

import { AuthPage } from './pages/AuthPage';
import { InventoryTracingPage } from './pages/InventoryTracingPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotificationsPage } from './pages/NotificationsPage'
import DropdownTextField from './components/DropdownTextField';

import { axPost } from './config/axios-config'

//import StockMovementPage from './pages/StockMovementPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
  },
});

const App: React.FC = () => {
  //const [visibleLayout, setVisibleLayout] = useState<boolean>(false);

  useEffect(() =>  {
    testT();
  }, []);


  async function testT() {
    try {
      const result: any = await axPost("/test", {})

      // let printString = "";
      //   Object.keys(result).forEach(key1 => {
      //       console.log(`    ${key1}: ${result[key1]}`);
      //       printString +=`{\n`;

      //       Object.keys(result[key1]).forEach(key2 => {
      //          printString +=`    [${key2}]: ${result[key1][key2]}\n`;
      //       })
      //       printString +=`}\n`;
      //   });
      //   alert(printString);

      //setData(result);
    } catch (error) {
      alert(error);
    }
  }


  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kicks off MUI's CSS reset for consistent rendering across browsers */}
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Auth Routes (No Sidebar/TopNav) */}
          <Route path="/login" element={<AuthPage type="Login" />} />
          <Route path="/signup" element={<AuthPage type="Signup" />} />





          {/* Test */}
          {/* <Route path="/drop-text" element={<DropdownTextField />} /> */}
          {/* <Route path="/test" element={<LogTest />} /> */}
          {/* <Route path="/movement" element={<StockMovementPage />} /> */}







          {/* Protected Routes (Wrapped in Layout) */}
          <Route
            path="/"
            element={
              <Layout>
                {/* The Outlet-like behavior happens by passing 
                    children to the Layout component */}
                <Navigate to="/dashboard" replace />
              </Layout>
            }
          />
          
          <Route path="/dashboard" element={
              <Layout><DashboardPage/></Layout>
              // <Layout visibility={visibleLayout}><DashboardPage setLayoutVisibility={setVisibleLayout}/></Layout>
            } />

          <Route path="/notifications" element={
              <Layout><NotificationsPage /> </Layout>
            } />
          
          <Route path="/tracing" element={
              <Layout><InventoryTracingPage /></Layout>
            } />

          {/* Fallback for 404s
          <Route path="*" element={<Navigate to="/login" />} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;