import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BillProvider } from "@/context/BillContext";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Dashboard from "@/pages/Dashboard";
import DepartmentOverheadForm from "@/pages/billForms/DepartmentOverheadForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[250px]">
        <Navbar />
        <main className="flex-1 container py-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BillProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              } 
            />
            <Route 
              path="/bills" 
              element={
                <AppLayout>
                  <Bills />
                </AppLayout>
              } 
            />
            <Route 
              path="/bills/department/new" 
              element={
                <AppLayout>
                  <DepartmentOverheadForm />
                </AppLayout>
              } 
            />
            {/* Add other routes for bill forms and views here */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </BillProvider>
  </QueryClientProvider>
);

export default App;
