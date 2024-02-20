/* eslint-disable @next/next/no-img-element */
import { gql } from '@apollo/client';
import { getClient } from '../lib/client';
import { Data, Result } from '@/types/types';

async function loadData(): Promise<Result[]> {
  const { data } = await getClient().query<Data>({
    query: gql`
      query {
        characters(page: 1, filter: { name: "beth" }) {
          results {
            id
            name
            image
          }
        }
      }
    `,
  });
  return data.characters.results;
}

export default async function HomePage() {
  const characters = await loadData();
  return (
    <div>
      <h1 className="text-center text-2xl mt-10 mb-5">Characters</h1>
      <div className="grid grid-cols-3">
        {characters?.map((character) => (
          <div key={character.id}>
            <h3>{character.name}</h3>
            <img src={character.image} alt={character.name} />
          </div>
        ))}
      </div>
    </div>
  );
}
