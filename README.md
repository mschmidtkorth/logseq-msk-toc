## Logseq Table of Contents Generator

This plugin lists all of the headings part of the current page and allows easy navigation by jumping to a headline.

Nested headings are only recognized if they are indented.

The following does *not* work:
```
# Level 1
## Level 2
```

The following works:
```
# Level 1
  ## Level 2
```

## Demo

![Demo video](./logseq-msk-toc.gif)

## Installation

1. Download the [latest release](https://github.com/mschmidtkorth/logseq-msk-toc/releases/tag/0.0.1)
1. Extract the zip file
1. Open Logseq > Three dots on the top right > Settings > Enable "Developer mode" at the bottom
1. Open Logseq > Three dots on the top right > Plugins > Load unpackaged plugin > Select the folder you extracted to

## Usage

- Put your cursor into any line and type `/toc` then hit `Return`
- Click anywhere to close the modal popup
