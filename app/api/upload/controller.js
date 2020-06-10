const { v4: uuidv4 } = require('uuid');

const accessCodes = require('../../../db/models/accessCodes');
const points = require('../../../db/models/points');

/**
 * @method checkValid
 *
 * Checks if a given access token is valid for use in consent and upload requests.
 *
 */
exports.checkValid = async (req, res) => {
  const { accessCode: codeValue } = req.body;

  if (codeValue == null) {
    res.status(400).send();
    return;
  }

  const code = await accessCodes.find({ value: codeValue });

  res.status(200).send({
    valid: (code != null && code.valid)
  });
};

/**
 * @method consent
 *
 * Sets consent status for the case associated with provided access token.
 * If consent is false, the access code is invalidated.
 *
 */
exports.consent = async (req, res) => {
  const { accessCode: codeValue, consent } = req.body;

  if (codeValue == null || consent == null) {
    res.status(400).send();
    return;
  }

  const code = await accessCodes.find({ value: codeValue });

  // Check validity of access code
  if (!code || !code.valid) {
    res.status(403).send();
    return;
  }

  await accessCodes.updateUploadConsent(code, consent);

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
  const { accessCode: codeValue, concernPoints: uploadedPoints } = req.body;

  if (codeValue == null || uploadedPoints == null) {
    res.status(400).send();
    return;
  }

  const code = await accessCodes.find({ value: codeValue });

  // Check validity of access code
  if (!code || !code.valid) {
    res.status(403).send();
    return;
  }

  // If consent isn't granted, then forbid upload
  if (!code.upload_consent) {
    res.status(451).send();
    return;
  }

  const uploadId = uuidv4();

  await points.createMany(uploadedPoints, code, uploadId);

  // Access code is one-time use
  await accessCodes.invalidate(code);

  res.status(201).send({
    uploadId: uploadId,
  });
};
