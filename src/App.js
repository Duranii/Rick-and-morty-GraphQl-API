import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import RickAndMortyCharacter from "./RickAndMortyCharacter";
import CharacterDetail from "./characterDetails/[slug]";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <Routes>
        <Route path="/" element={<RickAndMortyCharacter />} />
        <Route path="/character/:id" element={<CharacterDetail />} />
      </Routes>
    </Router>
  </QueryClientProvider>
);

export default App;
