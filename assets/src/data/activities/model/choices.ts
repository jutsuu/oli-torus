import { Choice, PostUndoable } from 'components/activities/types';
import { List } from 'data/activities/model/list';
import { TNode } from '@udecode/plate';
import { Operations } from 'utils/pathOperations';

const PATH = '$..choices';

export const Choices = {
  path: PATH,
  pathById: (id: string, path = PATH) => path + `[?(@.id==${id})]`,

  ...List<Choice>(PATH),

  setContent(id: string, content: TNode[]) {
    return (model: any, _post: PostUndoable) => {
      Operations.apply(model, Operations.replace(`$..choices[?(@.id==${id})].content`, content));
    };
  },
};
