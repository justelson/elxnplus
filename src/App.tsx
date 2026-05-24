import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import Everything from "./pages/admin/Everything";
import Upload from "./pages/admin/Upload";
import MediaList from "./pages/admin/MediaList";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/AdminLayout";

import { ThemeProvider } from "@/components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="elxnplus-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes wrapped in Layout */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/everything" element={<Everything />} />
              <Route path="/admin/upload" element={<Upload />} />
              <Route path="/admin/upload/:type" element={<Upload />} />
              <Route path="/admin/audio" element={<MediaList type="audio" title="Audio Logs" />} />
              <Route path="/admin/video" element={<MediaList type="video" title="Videos" />} />
              <Route path="/admin/documents" element={<MediaList type="document" title="Documents" />} />
              <Route path="/admin/notes" element={<MediaList type="note" title="Notes" />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
