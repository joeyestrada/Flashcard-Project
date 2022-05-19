import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { readCard, readDeck, updateCard } from "../utils/api";

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
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Front</label>
          <textarea
            className="form-control"
            id="front"
            name="front"
            rows="3"
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
            rows="3"
            onChange={changeHandler}
            value={formData.back}
          ></textarea>
        </div>
        <Link to={`/decks/${deckId}`}>
          <button className="btn btn-secondary mr-3">Cancel</button>
        </Link>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </>
  );
}

export default EditCard;
