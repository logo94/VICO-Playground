async function collegaItem(item1, item2) {
    const token = await ottieniToken(); // Funzione per ottenere un token di modifica
  
    const richiesta = {
      statements: [{
        "snaktype": "value",
        "property": "P128", // Sostituisci con la proprietà appropriata
        "datavalue": {
          "value": {
            "entity-type": "item",
            "numeric-id": item2.slice(1) // Rimuovi 'Q' e prendi l'id numerico
          },
          "type": "wikibase-entityid"
        }
      }],
      id: item1,
      token,
    };
  
    await axios.post(`https://www.wikidata.org/w/api.php?action=wbeditentity&format=json`, richiesta);
    console.log(`Collegati ${item1} e ${item2}`);
  }
  
  // Esempio di utilizzo
  collegaItem("Q12345", "Q67890");