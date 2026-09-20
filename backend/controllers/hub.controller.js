import Hub from '../models/Hub.js';

// GET /hubs   List all campus hubs
export async function listHubs(req, res) {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.tier) filter.tariffTier = req.query.tier;

    const hubs = await Hub.find(filter).sort({ name: 1 });
    res.json(hubs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /hubs/:id   Get single hub by ID
export async function getHubById(req, res) {
  try {
    const hub = await Hub.findById(req.params.id);
    if (!hub) return res.status(404).json({ error: 'Hub not found' });
    res.json(hub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /hubs   Create hub (admin)
export async function createHub(req, res) {
  try {
    const { name, type, coordinates, tariffTier } = req.body;
    if (!name || !coordinates?.lat || !coordinates?.lng) {
      return res.status(400).json({ error: 'Name and coordinates {lat, lng} are required' });
    }

    const hub = await Hub.create({
      name,
      type: type || 'other',
      coordinates,
      tariffTier: tariffTier || null,
    });

    res.status(201).json(hub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /hubs/:id   Update hub (admin)
export async function updateHub(req, res) {
  try {
    const hub = await Hub.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hub) return res.status(404).json({ error: 'Hub not found' });
    res.json(hub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE /hubs/:id   Delete hub (admin)
export async function deleteHub(req, res) {
  try {
    const hub = await Hub.findByIdAndDelete(req.params.id);
    if (!hub) return res.status(404).json({ error: 'Hub not found' });
    res.json({ message: 'Hub deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
