tenemos que crear

0. devolver todos los resultados

```json
{
  "query": {
    "match_all": {}
  }
}
```

1. query buscando un termino sin filtros

```json
{
  "query": {
    "match": {
      "announcement_summary": "galicia"
    }
  }
}
```

```json
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "announcement_summary": "galicia"
          }
        }
      ],
      "must_not": [],
      "should": []
    }
  },
  "from": 0,
  "size": 10,
  "sort": [],
  "aggs": {}
}
```

2. query con filtros

- fecha

```json
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "announcement_summary": "galicia"
          }
        },
        {
          "range": {
            "publication_date": {
              "gte": "2023-10-10",
              "lte": "2023-10-11" 
            }
          }
        }
      ],
      "must_not": [],
      "should": []
    }
  },
  "from": 0,
  "size": 10,
  "sort": [],
  "aggs": {}
}

```

- numero

```json
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "announcement_summary": "galicia"
          }
        },
        {
          "range": {
            "document_number": {
              "gt": "100",
              "lt": "200"
            }
          }
        }
      ],
      "must_not": [],
      "should": []
    }
  },
  "from": 0,
  "size": 10,
  "sort": [],
  "aggs": {}
}
```

- pagina

```json
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "announcement_summary": "galicia"
          }
        },
        {
          "range": {
            "document_page": {
              "gt": "100",
              "lt": "200"
            }
          }
        }
      ],
      "must_not": [],
      "should": []
    }
  },
  "from": 0,
  "size": 10,
  "sort": [],
  "aggs": {}
}
```

3. query con filtros de rango

- fecha

```json
```

- numero

```json

```

- pagina

```json

```

```json
Todos con Termino

{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "announcement_summary": "galicia"
          }
        },
        {
          "term": {
            "publication_date": "2023-10-10"
          }
        },
        {
          "term": {
            "document_page": "100"
          }
        },
        {
          "term": {
            "document_number": "100"
          }
        }
      ],
      "must_not": [],
      "should": []
    }
  },
  "from": 0,
  "size": 10,
  "sort": [],
  "aggs": {}
}
```	


Todos con rango

```json
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "announcement_summary": "galicia"
          }
        },
        {
          "range": {
            "publication_date": {
              "gt": "2023-10-10",
              "lt": "2023-10-11"
            }
          }
        },
        {
          "range": {
            "document_page": {
              "gt": "100",
              "lt": "200"
            }
          }
        },
        {
          "range": {
            "document_number": {
              "gt": "100",
              "lt": "200"
            }
          }
        }
      ],
      "must_not": [],
      "should": []
    }
  },
  "from": 0,
  "size": 10,
  "sort": [],
  "aggs": {}
}
```

El ranking no filtra la busqueda sino que filtra el resultado.
