const labelsMatchQuery = `SELECT ?item1 ?item1Label ?item2 ?item2Label
    WHERE 
    {
        {
            # Blocco 1: Confronto per istanze di persona (Q5 in Wikidata)
            # Trova le etichette e gli alias per il primo item
            ?item1 rdfs:label | skos:altLabel ?item1Label .
            # Trova le etichette e gli alias per il secondo item
            ?item2 rdfs:label | skos:altLabel ?item2Label .
            
            # Filtra per evitare di confrontare un item con se stesso
            FILTER (?item1 != ?item2)
            
            # Filtra solo gli item il cui ID inizia con "Q"
            FILTER (STRSTARTS(STR(?item1), "https://vicobncf.wikibase.cloud/entity/Q"))
            FILTER (STRSTARTS(STR(?item2), "https://vicobncf.wikibase.cloud/entity/Q"))
            
            # Filtra solo le istanze di persona (Q5 in Wikidata)
            ?item1 wdt:P31/wdt:P279* wd:Q5 .
            ?item2 wdt:P31/wdt:P279* wd:Q5 .
            
            # Estrai il cognome dalla forma con date (es. "Collodi, Carlo 1826-1890")
            BIND(
            IF(
                REGEX(?item1Label, "^[^,]+,"), 
                REPLACE(STRBEFORE(?item1Label, ","), "[0-9,-]", ""), 
                ?item1Label
            ) AS ?cognome1
            )
            BIND(
            IF(
                REGEX(?item2Label, "^[^,]+,"), 
                REPLACE(STRBEFORE(?item2Label, ","), "[0-9,-]", ""), 
                ?item2Label
            ) AS ?cognome2
            )
            
            # Estrai il cognome dalla forma diretta (es. "Carlo Collodi")
            BIND(
            IF(
                REGEX(?item1Label, "\\\\s\\\\w+\$"), 
                REPLACE(STRAFTER(?item1Label, " "), "[0-9,-]", ""), 
                ?item1Label
            ) AS ?cognome1Diretto
            )
            BIND(
            IF(
                REGEX(?item2Label, "\\\\s\\\\w+\$"), 
                REPLACE(STRAFTER(?item2Label, " "), "[0-9,-]", ""), 
                ?item2Label
            ) AS ?cognome2Diretto
            )
            
            # Confronta i cognomi
            FILTER (STR(?cognome1) = STR(?cognome2Diretto) || STR(?cognome2) = STR(?cognome1Diretto))
            
        }
        UNION
        {
            # Blocco 2: Confronto per tutti gli altri item (non persone)
            # Trova le etichette e gli alias per il primo item
            ?item1 rdfs:label | skos:altLabel ?item1Label .
            # Trova le etichette e gli alias per il secondo item
            ?item2 rdfs:label | skos:altLabel ?item2Label .
            
            # Filtra per evitare di confrontare un item con se stesso
            FILTER (?item1 != ?item2)
            
            # Filtra solo gli item il cui ID inizia con "Q"
            FILTER (STRSTARTS(STR(?item1), "https://vicobncf.wikibase.cloud/entity/Q"))
            FILTER (STRSTARTS(STR(?item2), "https://vicobncf.wikibase.cloud/entity/Q"))
            
            # Escludi le istanze di persona (Q5 in Wikidata)
            FILTER NOT EXISTS { ?item1 wdt:P31/wdt:P279* wd:Q5 . }
            FILTER NOT EXISTS { ?item2 wdt:P31/wdt:P279* wd:Q5 . }
            
            # Filtro per confrontare le etichette, assumendo che non contengano virgole
            FILTER(REGEX(?item1Label, STR(?item2Label), "i") || REGEX(?item2Label, STR(?item1Label), "i"))
        }
    }`;

export { labelsMatchQuery }