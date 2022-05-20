import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { readDeck, createCard } from "../utils/api/index";
import CardForm from "./CardForm";

function NewCard() {
  const initialFormData = {
    front: "",
    back: "",
  };
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [newCard, setNewCard] = useState(null);

  useEffect(() => {
    const abort = new AbortController();

    async function getDeck() {
      try {
        const deckFromAPI = await readDeck(deckId, abort.signal);
        setDeck(deckFromAPI);
      } catch (error) {
        console.log(error);
      }
    }
    getDeck();
    return () => abort.abort();
  }, [deckId]);

  useEffect(() => {
    const abort = new AbortController();

    if (!newCard) {
      return;
    } else {
      async function uploadCard() {
        try {
          await createCard(deckId, newCard, abort.signal);
        } catch (error) {
          console.log(error);
        }
      }
      uploadCard();
      return () => abort.abort();
    }
  }, [newCard, deckId]);

  const changeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setNewCard(formData);
    setFormData(initialFormData);
  };

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
          <li className="breadcrumb-item">
            <Link to={`/decks/${deckId}`}>{deck.name}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Add Card
          </li>
        </ol>
      </nav>
      <h3>{deck.name}: Add Card</h3>
      <CardForm
        changeHandler={changeHandler}
        submitHandler={submitHandler}
        formData={formData}
        deckId={deckId}
        newCard={true}
      />
    </>
  );
}

export default NewCard;
