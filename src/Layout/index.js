import React, { useState, useEffect } from "react";
import Header from "./Header";
import NotFound from "./NotFound";
import Home from "./Home";
import Study from "./Study";
import View from "./View";
import NewDeck from "./NewDeck";
import EditCard from "./EditCard";
import { Switch, Route, useHistory } from "react-router-dom";
import { listDecks, deleteDeck, createDeck } from "../utils/api/index";
import EditDeck from "./EditDeck";
import NewCard from "./NewCard";

function Layout() {
  const [decks, setDecks] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [newDeck, setNewDeck] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const abort = new AbortController();

    async function returnDecks() {
      try {
        const deckData = await listDecks(abort.signal);
        setDecks(deckData);
      } catch (error) {
        console.log(error);
      }
    }
    returnDecks();
    return () => abort.abort();
  }, []);

  useEffect(() => {
    const abort = new AbortController();

    if (!deleteId) {
      return;
    } else {
      async function deleteDeckByID() {
        try {
          await deleteDeck(deleteId, abort.signal);
          const deckData = await listDecks(abort.signal);
          setDecks(deckData);
        } catch (error) {
          console.log(error);
        }
      }
      deleteDeckByID();
      return () => abort.abort();
    }
  }, [deleteId]);

  useEffect(() => {
    const abort = new AbortController();

    if (!newDeck) {
      return;
    } else {
      async function createNewDeck() {
        try {
          await createDeck(newDeck, abort.signal);
          const deckData = await listDecks(abort.signal);
          setDecks(deckData);
        } catch (error) {
          console.log(error);
        }
      }
      createNewDeck();
      return () => abort.abort();
    }
  }, [newDeck]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this deck?")) {
      setDeleteId(id);
    }
  };

  const importDeckData = (deckData) => {
    let finalId = 1;
    for (let i = 1; i <= decks.length; i++) {
      decks.forEach((deck) => {
        if (deck.id === i && deck.id === finalId) {
          finalId++;
        } else {
          return;
        }
      });
    }
    setNewDeck({ ...deckData, id: finalId });
  };

  return (
    <>
      <Header />
      <div className="container">
        <Switch>
          <Route exact path="/">
            <Home decks={decks} deleteHandler={deleteHandler} />
          </Route>
          <Route path="/decks/:deckId/study">
            <Study history={history} />
          </Route>
          <Route path="/decks/new">
            <NewDeck importDeckData={importDeckData} />
          </Route>
          <Route path="/decks/:deckId/edit">
            <EditDeck />
          </Route>
          <Route path="/decks/:deckId/cards/:cardId/edit">
            <EditCard />
          </Route>
          <Route path="/decks/:deckId/cards/new">
            <NewCard />
          </Route>
          <Route path="/decks/:deckId">
            <View deleteHandler={deleteHandler} />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default Layout;
