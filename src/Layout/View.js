import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { readDeck, deleteCard } from "../utils/api/index";

function View({ deleteHandler }) {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const abort = new AbortController();

    async function getDeck() {
      try {
        const cardsFromAPI = await readDeck(deckId, abort.signal);
        setDeck(cardsFromAPI);
      } catch (error) {
        console.log(error);
      }
    }
    getDeck();
    return () => abort.abort();
  }, [deckId]);

  const deckDeleteHandler = () => {
    deleteHandler(deckId);
    history.push("/");
  };

  function CardsList({ deck }) {
    const cardDeleteHandler = async (id) => {
      if (
        window.confirm("Delete this card? You will not be able to recover it.")
      ) {
        const currentCard = deck.cards.find((card) => card.id === id);
        const abort = new AbortController();
        async function cardDelete() {
          try {
            await deleteCard(currentCard.id, abort.signal);
            const cardsFromAPI = await readDeck(deckId, abort.signal);
            setDeck(cardsFromAPI);
          } catch (error) {
            console.log(error);
          }
        }
        cardDelete();
        return () => abort.abort();
      }
    };

    return deck.cards.map((card, index) => {
      return (
        <div key={index} className="list-group-item">
          <div className="row">
            <p className="col">{card.front}</p>
            <p className="col">{card.back}</p>
          </div>
          <div className="row justify-content-end mr-1">
            <Link to={`/decks/${deckId}/cards/${card.id}/edit`}>
              <button className="btn btn-secondary mr-2">
                <i className="bi bi-pencil mr-2"></i>
                Edit
              </button>
            </Link>
            <button
              className="btn btn-danger"
              onClick={() => cardDeleteHandler(card.id)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      );
    });
  }

  if (!deck) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {deck.name}
          </li>
        </ol>
      </nav>
      <div>
        <h3>{deck.name}</h3>
        <p>{deck.description}</p>
        <div className="container">
          <div className="row justify-content-between">
            <div>
              <Link to={`/decks/${deckId}/edit`}>
                <button className="btn btn-secondary mr-1">
                  <i className="bi bi-wallet mr-1"></i>
                  Edit Deck
                </button>
              </Link>
              <Link to={`${deckId}/study`}>
                <button className="btn btn-primary mr-1">
                  <i className="bi bi-journal-bookmark mr-1"></i>
                  Study
                </button>
              </Link>
              <Link to={`/decks/${deckId}/cards/new`}>
                <button className="btn btn-primary">
                  <i className="bi bi-plus-lg mr-1"></i>Add Cards
                </button>
              </Link>
            </div>
            <button className="btn btn-danger" onClick={deckDeleteHandler}>
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
      <h2 className="mt-4">Cards</h2>
      <div className="mb-4">
        <CardsList deck={deck} />
      </div>
    </>
  );
}

export default View;
