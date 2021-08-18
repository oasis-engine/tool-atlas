import { findAllImageFilesSync } from "../utils";
import {
  AlgorithmType,
  AtlasFormat,
  MaxRectsMethod,
  MaxRectsOption,
  MaxRectsPacker,
} from "./algorithm";

const version = `__buildVersion`;
console.log(`atlas tool version: ${version}`);

export async function pack(imageFiles: Array<string>, cliOptions: any) {
  const realImageFiles: Array<string> = [];
  await findAllImageFilesSync(imageFiles, realImageFiles);

  switch (getAlgorithmType(cliOptions.algorithm)) {
    case AlgorithmType.MaxRects:
      return await packWithMaxRects(version, realImageFiles, {
        width: cliOptions.maxWidth || 1024,
        height: cliOptions.maxHeight || 1024,
        padding: cliOptions.padding || 0,
        allowRotate: cliOptions.allowRotate || false,
        square: cliOptions.square || false,
        pot: cliOptions.pot || false,
        format: getAtlasFormat(cliOptions.format || 'oasis'),
        output: cliOptions.output || 'oasis'
      });
    case AlgorithmType.Polygon:
      break;
    default:
      break;
  }
}

function getAlgorithmType(algorithm: string): AlgorithmType {
  switch (algorithm) {
    case "maxrects":
      return AlgorithmType.MaxRects;
    default:
      return AlgorithmType.MaxRects;
  }
}

function getAtlasFormat(format: string): AtlasFormat {
  switch (format) {
    case "oasis":
      return AtlasFormat.Oasis;
    default:
      return AtlasFormat.Oasis;
  }
}

async function packWithMaxRects(
  version: string,
  imageFiles: Array<string>,
  option: MaxRectsOption
) {
  const pack = new MaxRectsPacker(option);
  try {
    await pack.addImages(imageFiles);
  } catch(error) {
    return {
      code: 3,
      msg: 'Read image error'
    }
  }
  pack.pack(MaxRectsMethod.BestLongSideFit);
  return await pack.export(version, option.output);
}

