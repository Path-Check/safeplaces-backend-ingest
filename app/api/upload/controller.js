const accessCodes = require('../../../db/models/accessCodes');
const cases = require('../../../db/models/cases');
const trails = require('../../../db/models/trails');

/**
 * @method consent
 *
 * Sets consent status for the case associated with provided access token.
 * If consent is false, the access code is invalidated.
 *
 */
exports.consent = async (req, res) => {
  const { accessCode: codeId, consent } = req.body;

  if (codeId == null || consent == null ) {
    res.status(400).send();
    return;
  }

  const code = await accessCodes.findById(codeId);

  // Check validity of access code
  if (!code || !code.valid) {
    res.status(403).send();
    return;
  }

  const associatedCase = await cases.findById(code.case_id);

  // Check existence of case associated with the access code
  // (due to FKs this shouldn't happen in practice)
  if (!associatedCase) {
    res.status(404).send();
    return;
  }

  await cases.updateConsent(associatedCase.id, consent);

  // If consent isn't granted, access code can no longer be used
  if (!consent) {
    await accessCodes.invalidate(code);
  }

  res.status(200).send();
};

/**
 * @method upload
 *
 * Uploads points for the case associated with provided access token.
 * Requires the access token to be valid.
 *
 */
exports.upload = async (req, res) => {
  const { accessCode: codeId, concernPoints: points } = req.body;

  if (codeId == null || !points) {
    res.status(400).send();
    return;
  }

  const code = await accessCodes.findById(codeId);

  // Check validity of access code
  if (!code || !code.valid) {
    res.status(403).send();
    return;
  }

  const associatedCase = await cases.findById(code.case_id);

  // Check existence of case associated with the access code
  // (due to FKs this shouldn't happen in practice)
  if (!associatedCase) {
    res.status(404).send();
    return;
  }

  // If consent isn't granted, then forbid upload
  if (!associatedCase.consent) {
    res.status(403).send();
    return;
  }

  await trails.insertPoints(points, associatedCase.id);

  // Access code is one-time use
  await accessCodes.invalidate(code);

  res.status(201).send();
};
