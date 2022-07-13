import { ActivitySettings } from 'components/activities/common/authoring/settings/ActivitySettings';
import { shuffleAnswerChoiceSetting } from 'components/activities/common/authoring/settings/activitySettingsActions';
import { MultiInputSchema } from 'components/activities/vlab/schema';
import { AnswerKeyTab } from 'components/activities/multi_input/sections/AnswerKeyTab';
import { HintsTab } from 'components/activities/multi_input/sections/HintsTab';
// import { MultiInputStem } from 'components/activities/multi_input/sections/MultiInputStem';
import { VlabStem } from 'components/activities/vlab/sections/VlabStem';
import { QuestionTab } from 'components/activities/vlab/sections/QuestionTab';
import { VlabConfigTab } from 'components/activities/vlab/sections/VlabConfigTab';
import { Manifest } from 'components/activities/types';
import { elementsOfType } from 'components/editing/utils';
import { TabbedNavigation } from 'components/tabbed_navigation/Tabs';
import { InputRef } from 'data/content/model/elements/types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { configureStore } from 'state/store';
import {
  AuthoringElement,
  AuthoringElementProps,
  AuthoringElementProvider,
  useAuthoringElementContext,
} from '../AuthoringElement';

const store = configureStore();

export const MultiInputComponent = () => {
  const { dispatch, model } = useAuthoringElementContext<MultiInputSchema>();
  const [editor, setEditor] = React.useState<(ReactEditor & Editor) | undefined>();
  const [selectedInputRef, setSelectedInputRef] = React.useState<InputRef | undefined>(undefined);

  // Focus the active input ref selection when it changes
  React.useEffect(() => {
    if (!editor || !selectedInputRef) return;
    Transforms.select(editor, ReactEditor.findPath(editor, selectedInputRef));
  }, [selectedInputRef]);

  // Select the first input ref if none are selected
  React.useEffect(() => {
    if (!selectedInputRef && editor) {
      setSelectedInputRef(() => elementsOfType<InputRef>(editor, 'input_ref')[0]);
    }
  }, [editor]);

  const input = model.inputs.find((input) => input.id === selectedInputRef?.id);
  const index = model.inputs.findIndex((input) => input.id === selectedInputRef?.id);

  return (
    <>
      <img src="/images/vlab.png" />
      <VlabStem
        selectedInputRef={selectedInputRef}
        setSelectedInputRef={setSelectedInputRef}
        setEditor={setEditor}
      />
      {editor && input ? (
        <TabbedNavigation.Tabs>
          <TabbedNavigation.Tab label="Config">
            <VlabConfigTab editor={editor} />
          </TabbedNavigation.Tab>
          <TabbedNavigation.Tab label="Question">
            <QuestionTab editor={editor} input={input} index={index} />
          </TabbedNavigation.Tab>
          <TabbedNavigation.Tab label="Answer Key">
            <AnswerKeyTab input={input} />
          </TabbedNavigation.Tab>
          <TabbedNavigation.Tab label="Hints">
            <HintsTab input={input} index={index} />
          </TabbedNavigation.Tab>
          <ActivitySettings settings={[shuffleAnswerChoiceSetting(model, dispatch)]} />
        </TabbedNavigation.Tabs>
      ) : (
        'Select an input to edit it'
      )}
    </>
  );
};

export class VlabAuthoring extends AuthoringElement<MultiInputSchema> {
  render(mountPoint: HTMLDivElement, props: AuthoringElementProps<MultiInputSchema>) {
    ReactDOM.render(
      <Provider store={store}>
        <AuthoringElementProvider {...props}>
          <MultiInputComponent />
        </AuthoringElementProvider>
      </Provider>,
      mountPoint,
    );
  }
}
// eslint-disable-next-line
const manifest = require('./manifest.json') as Manifest;
window.customElements.define(manifest.authoring.element, VlabAuthoring);
