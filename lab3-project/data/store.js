// In-memory data store. Data resets whenever the server restarts.
let items = [
  { id: 1, title: 'Stardew Valley', platform: 'PC', status: 'Playing', rating: 9 },
  { id: 2, title: 'Celeste', platform: 'Switch', status: 'Completed', rating: 9.5 },
  { id: 3, title: 'Hades', platform: 'PC', status: 'Completed', rating: 8.5 },
  { id: 4, title: 'Hollow Knight', platform: 'Switch', status: 'Playing', rating: 8 },
  { id: 5, title: 'Disco Elysium', platform: 'PC', status: 'Wishlist', rating: 0 },
  { id: 6, title: 'Animal Crossing: New Horizons', platform: 'Switch', status: 'Completed', rating: 7 }
];
let nextId = 7;

export const getAll = () => [...items];

export const findById = (id) => items.find((item) => item.id === id);

export const create = (data) => {
  const item = { id: nextId++, ...data };
  items.push(item);
  return item;
};

export const remove = (id) => {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const [removed] = items.splice(index, 1);
  return removed;
};
