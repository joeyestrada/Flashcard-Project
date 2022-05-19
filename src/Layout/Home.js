import React from "react";
import HomeDecks from "./HomeDecks";
import { Link } from "react-router-dom";

function Home({ decks, deleteHandler }) {
  return (
    <div>
      <div className="pb-1">
        <Link to="/decks/new">
          <button href="#" className="btn btn-secondary">
            <i className="bi bi-plus-lg pr-1"></i>
            Create Deck
          </button>
        </Link>
      </div>
      <HomeDecks decks={decks} deleteHandler={deleteHandler} />
    </div>
  );
}

export default Home;
