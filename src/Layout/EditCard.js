import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { readCard, readDeck, updateCard } from "../utils/api";
import CardForm from "./CardForm";

function EditCard() {
  const { deckId, cardId } = useParams();
  const [deck, setDeck] = useState(null);
  const [formData, setFormData] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const abort = new AbortController();

    async function getDeck() {
      try {
        const deckFromAPI = await readDeck(deckId, abort.signal);
        const cardFromAPI = await readCard(cardId, abort.signal);
        setDeck(deckFromAPI);
        setFormData(cardFromAPI);
      } catch (error) {
        console.log(error);
      }
    }
    getDeck();
    return () => abort.abort();
  }, [cardId, deckId]);

  const changeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    await updateCard(formData);
    history.push(`/decks/${deckId}`);
  };

  if (!formData) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/decks/${deckId}`}>{deck.name}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Edit Card {cardId}
          </li>
        </ol>
      </nav>
      <h3>Edit Card {cardId}</h3>
      <CardForm
        changeHandler={changeHandler}
        submitHandler={submitHandler}
        formData={formData}
        deckId={deckId}
      />
    </>
  );
}

export default EditCard;
