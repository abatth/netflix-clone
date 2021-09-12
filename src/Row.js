import React, { useState, useEffect } from "react";
import axios from "./axios"; //not actually importing from axios module but just the "instance" from the axios.js file we created, can name the alias anything but calling it axios here
import "./Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  //snippet of code which runs based on a specific condition/variable
  useEffect(() => {
    // if [] run once when the row loads and dont run it again

    //when using api needs to request info so this is how you create the async function in a useEffect
    async function fetchData() {
      //await will say when you make this request wait for the promise to come back
      //this part is pretty much appending the fetched url to the end of the base url from the axios file we created
      const request = await axios.get(fetchUrl);
      //console.log(request.data.results);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
    //whenever you use anything inside a useEffect, if there is any variable that is being pulled in from outside and used inside useEffect you have to include it inside the dependancy array. So everytime this changes we need to update this variable.
  }, [fetchUrl]);

  //react youtube documentation
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    //if the movie trailer is already open and yoou click that picture then set the trailer url to be empty so it actually closes it
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      //movieTrailer is npm module and if you pass it in a name then it will try to find a youtube trailer for it, sometimes name is undefined so using '' as protection
      movieTrailer(movie?.name || "")
        .then((url) => {
          // https://www.youtube.com/watch?v=XtMThy8QKqU
          //so this will get us the exact string after the question mark
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  //   console.table(movies);
  //   console.log(movies);
  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {/*When we have a trailer url THEN we show the youtube video */}
      {trailerUrl && <Youtube videoid={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
