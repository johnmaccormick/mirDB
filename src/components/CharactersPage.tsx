import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./CharactersPage.css";
import "../index.css";

import supabaseClient from "../utils/supabase";


interface Character {
  id: number;
  name: string;
  honorific: string | null;
  book_num: number | null;
  chapter: { book_num: number, ch_num: number } | null;
}

interface CharactersPageProps {
  // Future props would go here
}

function CharactersPage(props: CharactersPageProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // console.log("CharactersPage() starting; characters:", characters);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabaseClient
        .from("characters")
        .select(
          // `
          //   id,
          //   name,
          //   honorifics!honorific(title),
          //   chapters!first_appears(book_num, ch_num)
          // `
          `
            id,
            name,
            honorifics!honorific(title)
          `
        );

      // console.log("Returned Data:", data);
      // console.log("Error:", error);
      
      if (error) {
        throw error;
      }

      setCharacters(
        (data || []).map(
          (item: any): Character => ({
            id: item.id,
            name: item.name,
            honorific: item.honorifics?.title || null,
            book_num: item.chapters?.book_num || null,
            chapter: item.chapters || null,
          })
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
        <div className="empty-state">No characters found.</div>
      ) : (
        <div className="characters-grid">
          {characters.map((character) => (
            <div key={character.id} className="character-card">
              <h2 className="character-name">{character.name}</h2>
              {/* {<p className="character-description">
                /Russian Name: {character.russian_name || "N/A"}
              </p>} */}

              <p className="character-description">
                honorific:&nbsp;
                {character.honorific ? character.honorific : "none"}
              </p>              
              <p className="character-description">
                first appears in book&nbsp;
                {character.chapter ? character.chapter.book_num : "'unknown'"},
                chapter&nbsp;{character.chapter ? character.chapter.ch_num : "'unknown'"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CharactersPage;
