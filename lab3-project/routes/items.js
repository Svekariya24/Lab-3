import { Router } from 'express';
import * as store from '../data/store.js';
import validateItem from '../middleware/validateItem.js';
import HttpError from '../utils/HttpError.js';

const router = Router();

const parseId = (raw) => {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    throw new HttpError(400, 'Item id must be a positive integer');
  }
  return id;
};

// GET /api/items - retrieve all records
router.get('/', (req, res) => {
  res.json(store.getAll());
});

// GET /api/items/:id - retrieve one record
router.get('/:id', (req, res) => {
  const id = parseId(req.params.id);
  const item = store.findById(id);
  if (!item) {
    throw new HttpError(404, `Item with id ${id} not found`);
  }
  res.json(item);
});

// POST /api/items - create a record (validated first)
router.post('/', validateItem, (req, res) => {
  const item = store.create(req.validatedItem);
  res.status(201).json(item);
});

// DELETE /api/items/:id - remove a record
router.delete('/:id', (req, res) => {
  const id = parseId(req.params.id);
  const removed = store.remove(id);
  if (!removed) {
    throw new HttpError(404, `Item with id ${id} not found`);
  }
  res.json({ message: `Item ${id} deleted`, item: removed });
});

export default router;
