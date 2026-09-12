# Landing and Buildup 1965 — recovered pages

Printed pages 203–210 recovered from the official USMC PDF (physical pages 219–226) using Qwen vision through AgentRelay. Printed pages 202 and 211 were independently transcribed as alignment checks, then left unchanged in the merged OCR. Existing IA scan metadata jumps from 202 to 211 on adjacent leaves.

The merged text is a derived, mixed-scan reading copy. Removing the inserted byte range reproduces the original IA OCR exactly. Original PDFs, OCR, XML, byte-offset citations and source manifests remain unchanged. New citations should reference a recovered page record and its official PDF page; do not use merged offsets against the original IA OCR.

Regenerate with `python scripts/merge-book-recovery.py` after the retained local model responses are available. Page images were rendered with Poppler at 2200 pixels on the long edge. Prompts, image hashes and complete responses remain under ignored data/local/book-recovery/. No Codex visual inspection was used.

- [Printed page 203](page-203.md)
- [Printed page 204](page-204.md)
- [Printed page 205](page-205.md)
- [Printed page 206](page-206.md)
- [Printed page 207](page-207.md)
- [Printed page 208](page-208.md)
- [Printed page 209](page-209.md)
- [Printed page 210](page-210.md)

```json
{
  "sourceId": "usmc-history-1965-pcn19000307600",
  "officialPdfSha256": "d0d7a1a2aa017e58f6306f7c5ea8c1e81d5659045ae3cbf1bb2d5ee18c8da385",
  "originalOcrSha256": "430686ebabb5acd3dc33cf24c747786412a6d9e5283d58b9ab387e718fad3815",
  "mergedOcrPath": "data/local/book-recovery/merged_ocr.txt",
  "mergedOcrSha256": "916af21a2f4dbb2dacd09dd272098e94b99fe7a7d1124bd5f4cdd454de4490c1",
  "insertAtOriginalByte": 721429,
  "insertedBytes": 32948,
  "boundaryChecks": [
    {
      "printedPage": 202,
      "officialPdfPage": 218,
      "existingOcrSimilarity": 0.9958,
      "action": "Calibration only; existing OCR retained byte-for-byte."
    },
    {
      "printedPage": 211,
      "officialPdfPage": 227,
      "existingOcrSimilarity": 0.9976,
      "action": "Calibration only; existing OCR retained byte-for-byte."
    }
  ],
  "recoveredPages": [
    {
      "printedPage": 203,
      "officialPdfPage": 219,
      "mergedByteStart": 721429,
      "mergedByteEndExclusive": 726670,
      "textSha256": "e2bba806d7cfbee2db747d908c64666d6ce1be6f165492bba8a72a7e8235dbef",
      "responseSha256": "037853bafe5b542b89a0ae18f7263c7fedc34ed98ffbe678d0cc2a2d014ad56d",
      "imageSha256": "9bcaf95b11764969d0bfa12dadaafb4e855b3b6ac111e84669b0767d477d227a",
      "model": "m1-pro/qwen3.8-flash-next-iq4xs",
      "fingerprint": "b10791-95ef7fc16",
      "generatedUnixTime": 1788840510,
      "uncertainties": [
        "block quote footnote marker 32 placement",
        "right column footnote marker 33 placement",
        "asterisk footnote marker after 'rest of the war.'",
        "spacing of ellipses in quoted footnote text"
      ]
    },
    {
      "printedPage": 204,
      "officialPdfPage": 220,
      "mergedByteStart": 726670,
      "mergedByteEndExclusive": 730503,
      "textSha256": "c06bdde4fb2d60102238388fb37d19da2ea88a797005b0ad175932ca4cee764e",
      "responseSha256": "40d649f146b092cfc6ac2dc20116d26e8ce1f569c6a1e6cab37ed599403c5990",
      "imageSha256": "f43469e94737dc9023c588885d5894e26520bfbf81a6de4d6a794d9622768df9",
      "model": "m1-pro/qwen3.8-flash-next-iq4xs",
      "fingerprint": "b10791-95ef7fc16",
      "generatedUnixTime": 1788840607,
      "uncertainties": [
        "footnote marker after 'bodies' rendered as superscript 1 (¹)",
        "em-dashes in the italic contents line rendered as long dashes",
        "quotation marks around 'fire brigade' and 'vats of local saki' rendered as double curly quotes"
      ]
    },
    {
      "printedPage": 205,
      "officialPdfPage": 221,
      "mergedByteStart": 730503,
      "mergedByteEndExclusive": 734761,
      "textSha256": "4e4c191f564ce9a60edda0e6d3d5662615a7fe3d4f5752be0f33f7ac6aad3e0a",
      "responseSha256": "10c822302b348adee87dc9e4199322dd7ba7b63c4bcc682b5324af269940b52b",
      "imageSha256": "842222982738dfa0149bb1c8e73ff7644a41468008c6d8a888cc35389704fb02",
      "model": "m1-pro/qwen3.8-flash-next-iq4xs",
      "fingerprint": "b10791-95ef7fc16",
      "generatedUnixTime": 1788840711,
      "uncertainties": [
        "portent spelled 'portent' in original text",
        "county vs country in 'take over the county' (as printed)",
        "superscript footnote markers 2,3,4,5 rendered inline"
      ]
    },
    {
      "printedPage": 206,
      "officialPdfPage": 222,
      "mergedByteStart": 734761,
      "mergedByteEndExclusive": 739671,
      "textSha256": "b113e7421486340e5c88e387b5d6dee49fa0aaaf0f35db5d4a9816ae0b8e6363",
      "responseSha256": "bed03d1214148428abda3030adcd90fdeac1ce29892e5fc7b3a42ce0901641fb",
      "imageSha256": "bd0371ea05bdba40df4d4b50b76f0002d3d24b98c9134bdca5b25d55fc8ed51a",
      "model": "m1-pro/qwen3.8-flash-next-iq4xs",
      "fingerprint": "b10791-95ef7fc16",
      "generatedUnixTime": 1788840818,
      "uncertainties": []
    },
    {
      "printedPage": 207,
      "officialPdfPage": 223,
      "mergedByteStart": 739671,
      "mergedByteEndExclusive": 743192,
      "textSha256": "04e6a94023fe37ce523cbf9316e85fb7218dcc73e4a2ef1f9e553549aa71745c",
      "responseSha256": "f1e562a491cd8ffb830ec50450fa3caeec652d08884befcef3195bccd89fa9f4",
      "imageSha256": "e1be7baccb5be3efc0321c7487d6197335d4d2cffff24697162637db8d32ad14",
      "model": "m1-pro/qwen3.8-flash-next-iq4xs",
      "fingerprint": "b10791-95ef7fc16",
      "generatedUnixTime": 1788840914,
      "uncertainties": [
        "caption word 'alineinent' appears as printed (likely 'alignment')",
        "footnote marker *11 rendered as *¹¹",
        "right column ends mid-word 'Viet-' at page edge"
      ]
    },
    {
      "printedPage": 208,
      "officialPdfPage": 224,
      "mergedByteStart": 743192,
      "mergedByteEndExclusive": 747371,
      "textSha256": "e83e5b531aff8a75c2fb62c733cfa441b590f9abe075ad28df34db7bf6a100cc",
      "responseSha256": "49fa102a4742fcab022745e68ef3bfaa7c592df61304209bb024f376d84c0f76",
      "imageSha256": "341d42b4846a36e289da7f214cba3545e28bf144a5d7362dfd60d6552ee91c21",
      "model": "m1-pro/qwen3.8-flash-next-iq4xs",
      "fingerprint": "b10791-95ef7fc16",
      "generatedUnixTime": 1788841021,
      "uncertainties": [
        "superscript footnote markers rendered as plain digits",
        "double asterisk footnote marker ** appears as '**' in body and footnote",
        "quotation marks around 'assigned to advisory duty MACV.' rendered as double single-quotes in source"
      ]
    },
    {
      "printedPage": 209,
      "officialPdfPage": 225,
      "mergedByteStart": 747371,
      "mergedByteEndExclusive": 749669,
      "textSha256": "49794f251128b823f6ae29e37bda76cd53b0f011a39395cd28eb75d2a8b16930",
      "responseSha256": "35a19f8859ddfa14eea0197ab5f5db080e78634f85eae9c910dca6439230503d",
      "imageSha256": "de10edeb553373e157acf230ea3289b9149e40a8c714be7d456a3ccd098ade4d",
      "model": "m1-pro/qwen3.8-flash-next-iq4xs",
      "fingerprint": "b10791-95ef7fc16",
      "generatedUnixTime": 1788841099,
      "uncertainties": []
    },
    {
      "printedPage": 210,
      "officialPdfPage": 226,
      "mergedByteStart": 749669,
      "mergedByteEndExclusive": 754377,
      "textSha256": "b168033d9d15fcca60d18f3862b3691e72781dfb0c4341cb00921d3f25911b60",
      "responseSha256": "8c82737a59708f8ba0c5c765d18303b6156a5def089aeb8027a1cd231993a381",
      "imageSha256": "a8456f79ba0332540de0fbc1968b79da9fcf5b69ed32065bce1fcdfb9926dab4",
      "model": "m1-pro/qwen3.8-flash-next-iq4xs",
      "fingerprint": "b10791-95ef7fc16",
      "generatedUnixTime": 1788841222,
      "uncertainties": [
        "footnote marker 17 placement at end of block quote",
        "footnote marker 18 after 'concurred'",
        "footnote marker 19 after 'arrived.'",
        "footnote marker 20 after 'ARVN.'",
        "footnote marker 21 after 'year.'",
        "last line of right column ends mid-sentence at page edge ('augmented by one')"
      ]
    }
  ],
  "reviewStatus": "Model transcription; preserves flagged uncertainties; not human-verified."
}
```
