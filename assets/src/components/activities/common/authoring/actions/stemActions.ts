import { PREVIEW_TEXT_PATH, STEM_PATH } from 'data/activities/model/utils';
import { HasPreviewText } from 'components/activities/types';
import { Operations } from 'utils/pathOperations';
import { toSimpleText } from 'components/editing/utils';
import { TNode } from '@udecode/plate';

export const StemActions = {
  editStem(content: TNode[], stemPath = STEM_PATH) {
    return (model: any) => {
      Operations.apply(model, Operations.replace(stemPath + '.content', content));
    };
  },
  editStemAndPreviewText(
    content: TNode[],
    stemPath = STEM_PATH,
    previewTextPath = PREVIEW_TEXT_PATH,
  ) {
    return (model: any & HasPreviewText) => {
      StemActions.editStem(content, stemPath)(model);
      Operations.apply(model, Operations.replace(previewTextPath, toSimpleText(content)));
    };
  },
};
