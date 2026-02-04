import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.resolve('Plot.V3/plot-data.json');
const raw = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(raw);

const errors = [];
const warnings = [];

const normalizeText = (text) => (text ?? '').trim();
const normalizeSpeaker = (speaker) => (speaker ?? '').trim();
const dialogKey = (entry) => `${normalizeSpeaker(entry.speaker)}|${normalizeText(entry.text)}`;

const plotEventDialogs = new Map();
const triggerIndex = new Map();

for (const [chapterKey, chapterValue] of Object.entries(data.plotData || {})) {
  if (!chapterValue) continue;
  for (const [sceneKey, sceneValue] of Object.entries(chapterValue || {})) {
    const triggers = Array.isArray(sceneValue?.triggers) ? sceneValue.triggers : [];
    for (const trigger of triggers) {
      if (!trigger?.id) continue;
      const eventId = `plot${chapterKey}-${sceneKey}-${trigger.id}`;
      const dialogs = Array.isArray(trigger.dialogs) ? trigger.dialogs : [];
      plotEventDialogs.set(eventId, dialogs);
      triggerIndex.set(eventId, { chapterKey, sceneKey, triggerId: trigger.id });

      const seen = new Set();
      dialogs.forEach((entry, idx) => {
        const key = dialogKey(entry);
        if (seen.has(key)) {
          warnings.push({
            type: 'duplicate-dialog-in-trigger',
            eventId,
            index: idx,
            dialog: entry
          });
        } else {
          seen.add(key);
        }
      });
    }
  }
}

const interactions = data.interactions || {};
for (const [chapterKey, chapterValue] of Object.entries(interactions)) {
  if (!chapterValue) continue;
  for (const [roomKey, roomValue] of Object.entries(chapterValue)) {
    const list = Array.isArray(roomValue) ? roomValue : [];
    list.forEach((interaction, idx) => {
      const position = interaction?.position || {};
      const size = interaction?.size || {};
      const hasBadPosition = !Number.isFinite(position.x) || !Number.isFinite(position.y);
      const hasBadSize = !Number.isFinite(size.x) || !Number.isFinite(size.y) || size.x <= 0 || size.y <= 0;
      if (hasBadPosition || hasBadSize) {
        errors.push({
          type: 'invalid-interaction-geometry',
          chapterKey,
          roomKey,
          index: idx,
          position,
          size
        });
      }

      const eventId = interaction?.event;
      if (eventId && !plotEventDialogs.has(eventId)) {
        warnings.push({
          type: 'interaction-missing-event',
          chapterKey,
          roomKey,
          index: idx,
          eventId
        });
      }

      const dialogs = Array.isArray(interaction?.dialogs) ? interaction.dialogs : [];
      if (dialogs.length > 0) {
        const seen = new Set();
        dialogs.forEach((entry, entryIdx) => {
          const key = dialogKey(entry);
          if (seen.has(key)) {
            warnings.push({
              type: 'duplicate-dialog-in-interaction',
              chapterKey,
              roomKey,
              index: idx,
              entryIndex: entryIdx,
              dialog: entry
            });
          } else {
            seen.add(key);
          }
        });

        if (eventId && plotEventDialogs.has(eventId)) {
          const expected = plotEventDialogs.get(eventId).map(dialogKey);
          const actual = dialogs.map(dialogKey);
          const sameLength = expected.length === actual.length;
          const sameContent = sameLength && expected.every((val, i) => val === actual[i]);
          if (!sameContent) {
            warnings.push({
              type: 'interaction-dialog-mismatch',
              chapterKey,
              roomKey,
              index: idx,
              eventId,
              expectedCount: expected.length,
              actualCount: actual.length
            });
          }
        }
      }
    });
  }
}

if (warnings.length === 0 && errors.length === 0) {
  console.log('plot-audit: OK (no issues found)');
  process.exit(0);
}

if (errors.length > 0) {
  console.error('plot-audit: errors');
  errors.forEach((err) => console.error(JSON.stringify(err, null, 2)));
}

if (warnings.length > 0) {
  console.warn('plot-audit: warnings');
  warnings.forEach((warn) => console.warn(JSON.stringify(warn, null, 2)));
}

process.exit(errors.length > 0 ? 1 : 0);
