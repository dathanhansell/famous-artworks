const { joinTables } = require("../utils/queryHelper");
const db = require("../models/db");

const getArtworksByArtist = async (req, res) => {
  const artistId = req.params.artistId;
  try {
    const artworks = await joinTables(
      "artworks",
      "artists",
      "created_by",
      "artist_id",
      "artwork_id",
      artistId
    );
    res.send(artworks);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
const getArtworksByMuseum = async (req, res) => {
  const museumId = req.params.museumId;

  try {
    const artworks = await joinTables(
      "artworks",
      "museums",
      "belongs_to",
      "museum_id",
      "artwork_id",
      museumId
    );
    res.send(artworks);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getArtworksByPeriod = async (req, res) => {
  const periodId = req.params.periodId;

  try {
    const artworks = await joinTables(
      "artworks",
      "art_periods",
      "included_in",
      "art_period_id",
      "artwork_id",
      periodId
    );
    res.send(artworks);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getArtworksByStyle = async (req, res) => {
  const styleId = req.params.styleId;

  try {
    const artworks = await joinTables(
      "artworks",
      "art_styles",
      "falls_under",
      "art_style_id",
      "artwork_id",
      styleId
    );
    res.send(artworks);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getArtworksByCollector = async (req, res) => {
  const collectorId = req.params.collectorId;

  try {
    const artworks = await joinTables(
      "artworks",
      "collectors",
      "owned_by",
      "collector_id",
      "artwork_id",
      collectorId
    );
    res.send(artworks);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
const getAllArtworks = (req, res) => {
  db.all("SELECT * FROM artworks", [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows);
  });
};

const createArtwork = (req, res) => {
  if (!req.body.title || !req.body.year || !req.body.medium) {
    return res.sendStatus(400);
  }

  let stmt = db.prepare(
    "INSERT INTO artworks (title, year, medium) VALUES (?,?,?)"
  );
  stmt.run(req.body.title, req.body.year, req.body.medium, (err) => {
    if (err) {
      return console.error(err.message);
    }
    res.send("Data inserted successfully!");
  });
  stmt.finalize();
};

const deleteArtwork = (req, res) => {
  const id = req.params.id;

  let stmt = db.prepare("DELETE FROM artworks WHERE id = ?");

  stmt.run(id, (err) => {
    if (err) {
      return console.error(err.message);
    }

    res.send("Artwork deleted successfully!");
  });
};

const updateArtwork = (req, res) => {
  const id = req.params.id;
  const update = req.body;

  if (!update.title || !update.year || !update.medium) {
    return res.sendStatus(400);
  }

  let stmt = db.prepare(
    "UPDATE artworks SET title = ?, year = ?, medium = ? WHERE id = ?"
  );

  stmt.run(update.title, update.year, update.medium, id, (err) => {
    if (err) {
      return console.error(err.message);
    }

    res.send("Data updated successfully!");
  });
};

module.exports = {
  getAllArtworks,
  createArtwork,
  deleteArtwork,
  updateArtwork,
  getArtworksByArtist,
  getArtworksByMuseum,
  getArtworksByCollector,
  getArtworksByPeriod,
  getArtworksByStyle,
};
