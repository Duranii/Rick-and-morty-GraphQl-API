import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { gql } from "graphql-request";
import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(process.env.REACT_APP_API_URL);

const CharacterDetail = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      const query = gql`
        query GetCharacter($id: ID!) {
          character(id: $id) {
            id
            name
            gender
            species
            image
            status
            location {
              name
            }
            created
          }
        }
      `;

      try {
        const data = await client.request(query, { id });
        // Format the created date
        data.character.created = formatDate(data.character.created);
        setCharacter(data.character);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching character:",
          error.response.errors[0].message
        );
        setError(
          "Error fetching character: " + error.response.errors[0].message
        );
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!character) {
    return <div>No character found</div>;
  }

  let circleColor;
  switch (character.status) {
    case "Alive":
      circleColor = "#00f700";
      break;
    case "Dead":
      circleColor = "red";
      break;
    default:
      circleColor = "#9e9e9e";
  }

  return (
    <div className="bg-slate-600 flex justify-center py-44 h-[100vh]">
      <div className="h-[500px] flex text-white bg-[#3c3e44] rounded-2xl">
        <img
          className="w-[600px] h-[500px] rounded-2xl"
          src={character.image}
          alt={character.name}
        />
        <div className="px-16 w-[600px]">
          <p className="pt-16 pb-4 text-5xl font-extrabold underline">
            {character.name}
          </p>

          <div className="flex items-center gap-3">
            <div
              className={`h-5 w-5 rounded-full mt-1`}
              style={{ backgroundColor: circleColor }}
            ></div>{" "}
            <p className="text-2xl text-center">{character.status}</p>
          </div>

          <p className="text-3xl pb-3 pt-16">
            <span className="text-[#9d9d9e] font-bold">Gender:</span>{" "}
            {character.gender}
          </p>

          <p className="text-3xl">
            <span className="text-[#9d9d9e] font-bold">Species:</span>{" "}
            {character.species}
          </p>

          <p className="py-3 text-3xl">
            <span className="text-[#9d9d9e] font-bold">Location:</span>{" "}
            {character.location.name}
          </p>

          <p className="text-3xl">
            <span className="text-[#9d9d9e] font-bold">Created:</span>{" "}
            {character.created}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;
