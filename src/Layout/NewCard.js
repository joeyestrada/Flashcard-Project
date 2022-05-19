import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { readDeck, createCard } from "../utils/api/index";

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
  }, [newCard]);

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
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Front</label>
          <textarea
            className="form-control"
            id="front"
            name="front"
            placeholder="Front side of card"
            required="required"
            onChange={changeHandler}
            value={formData.front}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Back</label>
          <textarea
            className="form-control"
            id="back"
            name="back"
            placeholder="Back side of card"
            required="required"
            onChange={changeHandler}
            value={formData.back}
          />
        </div>
        <Link to={`/decks/${deckId}`}>
          <button className="btn btn-secondary mr-2">Done</button>
        </Link>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Save
        </button>
      </form>
    </>
  );
}

export default NewCard;
