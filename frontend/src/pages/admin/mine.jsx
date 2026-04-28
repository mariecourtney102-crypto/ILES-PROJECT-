 useEffect(() => {
    axios.get("http://localhost:8000/api/opportunities/")
      .then(res => setOpportunities(res.data))
      .catch(err => console.error(err));
  }, []);