# 1965 source alignment

2026-09-07. Source 1201048065; PDF SHA-256 96b682a91c088a43e9964cb7a4e8e64440ea0e0c312d0162b06fd0a866f2c931.

## Method and status

Brent authorized local vision models through AgentRelay. Qwen3.8 Flash Next loaded but rejected image input (missing vision projector). Gemma4-12B-Q4 on M1 Pro processed rendered images with its existing projector; runtime fingerprint b10809-5266f24da. Original PDF and OCR bytes are unchanged. Codex did not visually inspect source pages.

Full-page coordinate estimates were inconsistent and rejected. Poppler rendered page 2 at 1800 pixels on the long edge. Deterministic ink-density segmentation produced numbered scan regions; Gemma matched passage text to those region IDs. Accepted bounds come from those measured regions, not the model's rejected coordinate estimates. A region can contain several lines; boxes cover passage regions, not individual words. The August assignment list's endpoint also uses the existing Doherty alignment. Model alignment remains subject to human review and does not resolve OCR spelling disputes.

Six additional regions are enabled; ten anchors remain page-only. The M1 Pro Gemma profile disappeared during processing and the host switched back to an active Qwen request. Remaining candidates, including all page-three estimates and the merged September 22/November 1 region, were not accepted. Restore a stable vision profile before continuing.

## Accepted region mappings

```json
[
  {
    "id": "return-san-diego",
    "page": 2,
    "rect": [
      0.399712,
      0.278333,
      0.540618,
      0.029444
    ],
    "regions": [
      "L07",
      "L08"
    ],
    "scope": "Passage region matched by Gemma."
  },
  {
    "id": "command-august",
    "page": 2,
    "rect": [
      0.399712,
      0.322222,
      0.540618,
      0.042778
    ],
    "regions": [
      "L09",
      "L10"
    ],
    "scope": "Command transfer sentence; excerpt also includes the subsequent assignment list."
  },
  {
    "id": "command-september-8",
    "page": 2,
    "rect": [
      0.399712,
      0.512778,
      0.540618,
      0.041667
    ],
    "regions": [
      "L19",
      "L20"
    ],
    "scope": "Passage region matched by Gemma."
  },
  {
    "id": "xo-september-17",
    "page": 2,
    "rect": [
      0.399712,
      0.675,
      0.540618,
      0.043333
    ],
    "regions": [
      "L25",
      "L26",
      "L27"
    ],
    "scope": "Passage region matched by Gemma."
  },
  {
    "id": "command-september-18",
    "page": 2,
    "rect": [
      0.399712,
      0.732222,
      0.540618,
      0.042222
    ],
    "regions": [
      "L28",
      "L29",
      "L30"
    ],
    "scope": "Passage region matched by Gemma."
  },
  {
    "id": "assignments-august",
    "page": 2,
    "rect": [
      0.399712,
      0.322222,
      0.540618,
      0.173889
    ],
    "regions": [
      "L09",
      "L18"
    ],
    "scope": "Start matched by Gemma; end cross-checked with existing visually reviewed doherty-august anchor and crop response ending DOHERTY."
  }
]
```

## Local reproducibility files

Images, request prompts, raw model responses and helper scripts are retained under ignored data/local/alignment/. They are local derived working files, not imported originals or published model output. Response hashes:

```json
[
  {
    "file": "data/local/alignment/identify-response-2-0.json",
    "sha256": "a608783ffa1008114e4bb6bc648c16504df497c7f43c4f7120d14d78bdcded68"
  },
  {
    "file": "data/local/alignment/identify-response-2-1.json",
    "sha256": "d17b98d3def0b82953eeb41057a19487492b8a0543c9ecdafa0580b214075e2e"
  },
  {
    "file": "data/local/alignment/crop-response-2-0.json",
    "sha256": "f41fec890d7898e8aeaee97dbd5d9fb0d995a5774491be5fc96f76cc216d7ab5"
  },
  {
    "file": "data/local/alignment/rows.json",
    "sha256": "ae21313bf13ffe09bab56b0f331ad9e2ba87be13bb42b64e3e1e9ced0f630526"
  },
  {
    "file": "data/local/alignment/detail-2.png",
    "sha256": "48bde843522c137083038f7507f191360f841d15eff603291dc1eadd87d19124"
  }
]
```
