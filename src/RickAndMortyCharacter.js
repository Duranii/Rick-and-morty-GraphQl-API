import React, { useState } from "react";
import { useQuery } from "react-query";
import { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import Pagination from "@mui/material/Pagination/Pagination";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import Logo from "../src/assets/tt.webp";

const client = new GraphQLClient(process.env.REACT_APP_API_URL);

const fetchData = async (page, gender, searchQuery) => {
  try {
    const query = gql`
      query GetCharacters($page: Int!, $gender: String, $searchQuery: String) {
        characters(page: $page, filter: { gender: $gender, name: $searchQuery }) {
          results {
            id
            name
            gender
            species
            image
          }
          info {
            count
            next
            pages
            prev
          }
        }
      }
    `;

    const data = await client.request(query, { page, gender, searchQuery });
    return data.characters;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
};

const RickAndMortyCharacter = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGender, setSelectedGender] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const { data, isLoading, isError } = useQuery(
    ["rickAndMortyData", currentPage, selectedGender, debouncedSearchQuery],
    () => fetchData(currentPage, selectedGender, debouncedSearchQuery)
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.history.pushState({}, "", `page=${value}`);
  };

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    // Debouncing the search input
    setTimeout(() => {
      setDebouncedSearchQuery(event.target.value);
    }, 2000); // Adjust the delay as needed
  };

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error fetching data</div>;

  return (
    <div className="bg-slate-600">
      <div className="flex items-center justify-between px-14 pt-14">
        <img className="h-28 cursor-pointer" src={Logo} alt="logo" />

        <div className="flex justify-end">
          <select
            className="w-60 text-2xl p-2 rounded cursor-pointer"
            value={selectedGender}
            onChange={handleGenderChange}
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="unknown">Unknown</option>
          </select>
          <input
            type="text"
            placeholder="Search by name"
            className="ml-4 w-60 text-2xl p-2 rounded"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
      </div>
      <div className="flex justify-evenly flex-wrap gap-y-16 py-16">
        {data &&
          data.results.map((character) => (
            <div
              className="text-white text-center bg-[#3c3e44] rounded-lg"
              key={character.id}
            >
              <Link to={`/character/${character.id}`}>
                <img
                  className="rounded-lg"
                  src={character.image}
                  alt={character.name}
                />
                <p className="pt-5 text-2xl font-bold hover:text-orange-400">
                  {character.name}
                </p>
                <p className="py-3 text-xl">{character.species}</p>
                <p className="pb-5 text-xl">{character.gender}</p>
              </Link>
            </div>
          ))}
      </div>
      <div className="flex justify-center pt-5 pb-16">
        <Stack spacing={2}>
          <Pagination
            count={data.info.pages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-page': {
                color: 'white',
                border: '1px solid white'
              },
              '& .MuiPaginationItem-root.Mui-selected': {
                color: 'white',
                border: '5px solid purple',
                background: 'purple'
              },
              '& .MuiPaginationItem-icon': {
                color: 'white',
                border: '1px solid white',
              },
            }}
          />
        </Stack>
      </div>
    </div>
  );
};

export default RickAndMortyCharacter;
