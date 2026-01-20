import Organization from '../models/Organization.js';

export const getMyOrganizations = async (req, res) => {
  const orgs = await Organization.find({ 'members.userId': req.user._id });
  res.json(orgs);
};

export const createOrganization = async (req, res) => {
  const { name } = req.body;
  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
  
  const org = await Organization.create({
    name,
    slug,
    ownerId: req.user._id,
    members: [{ userId: req.user._id, role: 'admin' }]
  });
  res.json(org);
};
