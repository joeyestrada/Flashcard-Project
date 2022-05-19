import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { readDeck } from "../utils/api/index";

function Study({ history }) {
  const [itr, setItr] = useState(0);
  const [next, setNext] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);

  useEffect(() => {
    const abort = new AbortController();

    async function loadDeck() {
      try {
        const deckFromAPI = await readDeck(deckId, abort.signal);
        setDeck(deckFromAPI);
      } catch (error) {
        console.log(error);
      }
    }
    loadDeck();
    return () => abort.abort();
  }, [deckId]);

  const flipHandler = () => {
    setFlipped(!flipped);
    setNext(true);
  };

  const nextHandler = () => {
    if (itr === deck.cards.length - 1) {
      if (window.confirm("Would you like to restart this deck?")) {
        setNext(false);
        setItr(0);
        setFlipped(false);
      } else {
        history.push("/");
      }
    } else {
      setNext(false);
      setItr(itr + 1);
      setFlipped(false);
    }
  };

  if (!deck) {
    return <h1>Loading...</h1>;
  }
  if (deck.cards.length < 3) {
    return (
      <div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/decks/${deckId}`}>{deck.name}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Study
            </li>
          </ol>
        </nav>
        <h1>{deck.name}: Study</h1>
        <h4>Not enough cards.</h4>
        <p>
          You need at least 3 cards to study. There are {deck.cards.length}{" "}
          cards in this deck.
        </p>
        <Link to={`/decks/${deckId}/cards/new`}>
          <button className="btn btn-primary">
            <i className="bi bi-plus-lg pr-2"></i>
            Add Cards
          </button>
        </Link>
      </div>
    );
  }
  if (deck) {
    const card = deck.cards[itr];
    return (
      <div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/decks/${deckId}`}>{deck.name}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Study
            </li>
          </ol>
        </nav>
        <h1>{deck.name}: Study</h1>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">
              Card {itr + 1} of {deck.cards.length}
            </h5>
            {!flipped && <p className="card-text">{card.front}</p>}
            {flipped && <p className="card-text">{card.back}</p>}
            <button className="btn btn-secondary mr-2" onClick={flipHandler}>
              Flip
            </button>
            {next && (
              <button className="btn btn-primary" onClick={nextHandler}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Study;
