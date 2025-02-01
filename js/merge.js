async function autoMerge(uri1, uri2) {
    
    // Interroga le entità di Wikidata via API
    const risposte = await axios.all([
      axios.get(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${uri1}&format=json`),
      axios.get(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${uri2}&format=json`),
    ]);
  
    // Estrae i dati delle entità
    const dati1 = risposte[0].data;
    const dati2 = risposte[1].data;
  
    // Verifica se le entità esistono e hanno almeno una proprietà
    if (!dati1.entities[uri1] || !dati2.entities[uri2] || Object.keys(dati1.entities[uri1].claims).length === 0 || Object.keys(dati2.entities[uri2].claims).length === 0) {
      console.log("Una o entrambe le entità non esistono o non hanno proprietà");
      return;
    }
  
    // Esegue il merge dei dati per copiare le proprietà
    const datiMesi = _(dati1.entities[uri1].claims).merge(dati2.entities[uri2].claims).value();
  
    // Interroga l'API per aggiornare le proprietà dell'entità con più proprietà
    const aggiornaDati = await axios.post(`https://www.wikidata.org/w/api.php?action=wbeditentity&format=json&token=${dati1.query.tokens.tedit}&id=${uri2}`, { claims: datiMesi });
  
    console.log("Dati aggiornati correttamente");
  }
  
  // Esempio di utilizzo
  //copiaDatiWikidata("Q12345", "Q67890");