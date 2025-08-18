import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./CharactersPage.css";
import "../index.css";

import supabaseClient from "../utils/supabase";

// Define the type for your character data
// interface Character {
//   id: number;
//   name: string;
//   honorific: string;
//   first_appears: number;
// }
interface Character {
  id: number;
  name: string;
  // russian_name: string;
  honorifics: {
    title: string | null;
  } | null;
  chapters: {
    book_num: number;
    //       ch_num: number;
    //     }[]
    //   | null;
  } | null;
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
      // const { data, error } = await supabaseClient
      //   .from('characters')
      //   .select('id, name, honorific, first_appears'); // Select the columns you want

      //     const { data, error } = await supabaseClient.from("characters").select(`
      //         id,
      //         name,
      //         russian_name,
      //         honorifics!honorific(title),
      //         chapters!first_appears(book_num, ch_num)
      // `);

      const { data, error } = await supabaseClient
        .from("characters")
        .select("id, name, honorifics!honorific(title)")
        .eq("id", 2);

      console.log("Returned Data:", data);
      console.log("Error:", error);
      console.log("typeof data?.[0]: ", typeof data?.[0]);

      if (error) {
        throw error;
      }

      setCharacters(
        (data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          honorifics: Array.isArray(item.honorifics)
            ? item.honorifics[0] || null
            : item.honorifics || null,
          chapters: item.chapters || null,
        }))
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
                {character.honorifics ? character.honorifics.title : "none"}
              </p>
              <p className="character-description">
                first appears in book&nbsp;
                {character.chapters ? character.chapters.book_num : "'unknown'"}
              </p>
              {/* {character.chapters?.[0] && (
                <p className="character-description">
                  book {character.chapters[0].book_num}, chapter{" "}
                  {character.chapters[0].ch_num}
                </p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CharactersPage;
