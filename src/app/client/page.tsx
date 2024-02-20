/* eslint-disable @next/next/no-img-element */
'use client';
import { Data } from '@/types/types';
import { gql } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { useState } from 'react';

const queryGraphQL = ({
  page,
  query,
}: {
  page?: number;
  query?: string;
}) => gql`
  query {
    characters(page: ${page}, filter: { name: "${query}" }) {
      results {
        id
        name
        image
      }
    }
  }
`;

export default function ClientPage() {
  const [query, setQuery] = useState('summer');
  const [page, setPage] = useState(1);
  const { data } = useSuspenseQuery<Data>(queryGraphQL({ query, page }));

  const handleSubmit = (
    evt: React.SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) => {
    evt.preventDefault();
    const formData = new FormData(evt.currentTarget);
    const formDataJSON = Object.fromEntries(formData.entries());

    setQuery(formDataJSON.query as string);
    setPage(1);
  };

  const handleNextPage = () => {
    if (page - 1 <= 0) return;
    setPage(page - 1);
  };
  const handlePrevPage = () => {
    if (data.characters.results.length === 0) return;
    setPage(page + 1);
  };

  return (
    <div className="p-5 max-w-screen-xl">
      <form
        className="flex flex-col items-center gap-2 max-w-lg mx-auto text-md my-4"
        onSubmit={handleSubmit}
      >
        <input
          className="p-2 rounded w-full"
          type="text"
          name="query"
          placeholder="Search a character..."
        />
        <button className="px-5 py-2 border rounded border-zinc-500 hover:bg-zinc-300">
          Search
        </button>
      </form>
      <div className="grid grid-cols-4 gap-4">
        {data.characters.results.map((character) => (
          <article key={character.id}>
            <h3>{character.name}</h3>
            <img src={character.image} alt={character.name} />
          </article>
        ))}
      </div>
      <div className="flex justify-center items-center gap-4 text-2xl mt-4">
        <button
          onClick={handleNextPage}
          disabled={page <= 1}
          className="rounded-full h-12 w-12 disabled:bg-zinc-300 border border-zinc-400 hover:bg-zinc-300"
        >
          {'<'}
        </button>
        <span>{page}</span>
        <button
          onClick={handlePrevPage}
          disabled={data.characters.results.length < 20}
          className="rounded-full h-12 w-12 disabled:bg-zinc-300 border border-zinc-400 hover:bg-zinc-300"
        >
          {'>'}
        </button>
      </div>
    </div>
  );
}
