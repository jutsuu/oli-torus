import React, { useState, useRef, useEffect } from 'react';
import * as ContentModel from 'data/content/model/nodes/types';
import guid from 'utils/guid';
<<<<<<< HEAD:assets/src/components/editing/nodes/blockcode/Settings.tsx
import * as Settings from 'components/editing/nodes/settings/Settings';
import { CommandContext } from 'components/editing/nodes/commands/interfaces';
=======
import * as Settings from 'components/editing/elements/common/settings/Settings';
import { CommandContext } from 'components/editing/elements/commands/interfaces';
>>>>>>> fix-toolbar:assets/src/components/editing/nodes/blockcode/BlockcodeSettings.tsx

type CodeSettingsProps = {
  model: ContentModel.Code;
  onEdit: (model: ContentModel.Code) => void;
  onRemove: () => void;
  commandContext: CommandContext;
  editMode: boolean;
};

export const CodeSettings = (props: CodeSettingsProps) => {
  // Which selection is active, URL or in course page
  const [model, setModel] = useState(props.model);
  const [checkId] = useState(guid());

  const ref = useRef();

  useEffect(() => {
    // Inits the tooltips, since this popover rendres in a react portal
    // this was necessary
    if (ref !== null && ref.current !== null) {
      (window as any).$('[data-toggle="tooltip"]').tooltip();
    }
  });

  const setCaption = (caption: string) => setModel(Object.assign({}, model, { caption }));

  const onChange = (e: any) => {
    const language = e.target.value;
    setModel(Object.assign({}, model, { language }));
  };

  const applyButton = (disabled: boolean) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        props.onEdit(model);
      }}
      disabled={disabled}
      className="btn btn-primary ml-1"
    >
      Apply
    </button>
  );

  return (
    <div className="settings-editor-wrapper">
      <div className="settings-editor" ref={ref as any}>
        <div className="d-flex justify-content-between mb-2">
          <div>Source Code</div>

          <div>
            <Settings.Action
              icon="fas fa-trash"
              tooltip="Remove Code Block"
              id="remove-button"
              onClick={() => props.onRemove()}
            />
          </div>
        </div>

        <form className="form"></form>

        {applyButton(!props.editMode)}
      </div>
    </div>
  );
};
