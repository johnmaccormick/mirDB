import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './CharactersPage.css'; // Component-specific styles
import '../index.css'; // Your main CSS file

import supabaseClient from "../utils/supabase";


// Define the type for your character data
interface Character {
  id: number;
  name: string;
  first_appears: number;
}

interface CharactersPageProps {
  // Future props would go here
}

function CharactersPage(props: CharactersPageProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from the characters table
      // Replace 'name' and 'description' with your actual column names
      const { data, error } = await supabaseClient
        .from('characters')
        .select('id, name, description'); // Select the columns you want

      if (error) {
        throw error;
      }

      setCharacters(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-center">
        <div className="loading-message">Loading characters...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-center">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="characters-page">
      <h1 className="page-title">Characters</h1>
      
      {characters.length === 0 ? (
        <div className="empty-state">
          No characters found.
        </div>
      ) : (
        <div className="characters-grid">
          {characters.map((character) => (
            <div key={character.id} className="character-card">
              <h2 className="character-name">{character.name}</h2>
              <p className="character-description">{character.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharactersPage;