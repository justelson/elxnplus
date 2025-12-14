import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import Upload from "./pages/admin/Upload";
import MediaList from "./pages/admin/MediaList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/upload" element={<Upload />} />
          <Route path="/admin/audio" element={<MediaList type="audio" title="Audio Files" />} />
          <Route path="/admin/video" element={<MediaList type="video" title="Videos" />} />
          <Route path="/admin/documents" element={<MediaList type="document" title="Documents" />} />
          <Route path="/admin/notes" element={<MediaList type="note" title="Notes" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
