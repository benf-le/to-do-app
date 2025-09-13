import './App.css'
import {Route, Routes,BrowserRouter as Router} from "react-router-dom";
import {routes} from "./routes";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <div >
        <Router>
            <Routes>
                {
                    routes.map((route) => {
                        const Page = route.page

                        return (
                            <Route key={route.path} path={route.path} element={
                                <QueryClientProvider client={queryClient}>
                                    <Page />
                                </QueryClientProvider>
                            }/>


                        )
                    })
                }
            </Routes>
        </Router>
    </div>
  )
}

export default App