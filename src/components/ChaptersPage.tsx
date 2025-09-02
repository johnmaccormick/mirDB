import React, { useState, useEffect } from "react";
import supabaseClient from "../utils/supabase";
import "./ChaptersPage.css";
import "../index.css";

interface Chapter {
  id: number;
  mse_book: number;
  mse_part: number;
  mse_chapter: number;
  ors_book: number;
  ors_chapter: number;
  opening_line: string;
  page_num: number | null;
  // short_summary: string | null;
  // long_summary: string | null; 
}

interface ChaptersPageProps {
  // Future props would go here
}

function ChaptersPage(props: ChaptersPageProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabaseClient
        .from("chapters")
        .select(
          `
            id,
            mse_book,
            mse_part,
            mse_chapter,
            ors_book,
            ors_chapter,
            opening_line,
            page_num
          `
        )
        .order("mse_book", { ascending: true })
        .order("mse_part", { ascending: true })
        .order("mse_chapter", { ascending: true });

      if (error) {
        throw error;
      }

      setChapters(
        (data || []).map(
          (item: any): Chapter => ({
            id: item.id,
            mse_book: item.mse_book,
            mse_part: item.mse_part,
            mse_chapter: item.mse_chapter,
            ors_book: item.ors_book,
            ors_chapter: item.ors_chapter,
            opening_line: item.opening_line,
            page_num: item.page_num,
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
        <div className="loading-message">Loading chapters...</div>
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
    <div className="chapters-page">
      <h1 className="page-title">Chapters</h1>

      {chapters.length === 0 ? (
        <div className="empty-state">No chapters found.</div>
      ) : (
        <div className="chapters-grid">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="chapter-card">
              <div className="chapter-header">
                <h2 className="chapter-title">
                  Book {chapter.mse_book}, Part {chapter.mse_part}, Chapter{" "}
                  {chapter.mse_chapter}
                </h2>
                {/* <div className="page-number">
                  <span className="page-label">page: {chapter.page_num ? chapter.page_num : "unknown"}</span>
                </div>
                <div className="chapter-reference">
                  <span className="reference-label">Original Russian:</span>
                  <span>Book {chapter.ors_book}, Chapter {chapter.ors_chapter}</span>
                </div> */}
                <div className="chapter-reference">
                  <span className="page-label">
                    page {chapter.page_num ? chapter.page_num : "unknown"}
                  </span>
                  <span className="separator"> | </span>
                  <span className="reference-label">Original Russian:</span>
                  <span>
                    Book {chapter.ors_book}, Chapter {chapter.ors_chapter}
                  </span>
                </div>
              </div>
              <div className="opening-line">
                <span className="opening-label">Opening:</span>
                <p className="opening-text">{chapter.opening_line}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChaptersPage;
