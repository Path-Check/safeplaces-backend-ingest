const { organizationService } = require('../../lib/db');

/**
 * @method fetchOrganization
 *
 * Fetches information about an organization.
 *
 */
exports.fetchOrganization = async (req, res) => {
  const { id } = req.query;

  if (id == null) {
    res.status(400).send();
    return;
  }

  const organization = await organizationService.find({ external_id: id });

  if (organization == null) {
    res.status(404).send();
    return;
  }

  res.status(200).json(organization);
};
