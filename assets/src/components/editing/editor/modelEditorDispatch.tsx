import { AudioEditor } from 'components/editing/nodes/audio/Editor';
import { CodeEditor } from 'components/editing/nodes/blockcode/Editor';
import { BlockQuoteEditor } from 'components/editing/nodes/blockquote/BlockquoteElement';
import { CommandContext } from 'components/editing/nodes/commands/interfaces';
import { ImageEditor } from 'components/editing/nodes/image/Editor';
import { InputRefEditor } from 'components/editing/nodes/inputref/Editor';
import { LinkEditor } from 'components/editing/nodes/link/Editor';
import { PopupEditor } from 'components/editing/nodes/popup/Editor';
import { TableEditor } from 'components/editing/nodes/table/TableEditor';
import { TdEditor } from 'components/editing/nodes/table/TdEditor';
import { ThEditor } from 'components/editing/nodes/table/ThEditor';
import { TrEditor } from 'components/editing/nodes/table/TrEditor';
import { WebpageEditor } from 'components/editing/nodes/webpage/Editor';
import { YouTubeEditor } from 'components/editing/nodes/youtube/Editor';
import { Mark } from 'data/content/model/text';
import * as React from 'react';
import { RenderElementProps } from 'slate-react';
import * as ContentModel from 'data/content/model/nodes/types';
import { EditorProps } from 'components/editing/nodes/interfaces';

export function editorFor(
  model: ContentModel.ModelElement,
  props: RenderElementProps,
  commandContext: CommandContext,
): JSX.Element {
  const { attributes, children } = props;

  const editorProps = {
    model,
    attributes,
    children,
    commandContext,
  };

  switch (model.type) {
    case 'p':
      return <p {...attributes}>{children}</p>;
    case 'h1':
      return <h1 {...attributes}>{children}</h1>;
    case 'h2':
      return <h2 {...attributes}>{children}</h2>;
    case 'h3':
      return <h3 {...attributes}>{children}</h3>;
    case 'h4':
      return <h4 {...attributes}>{children}</h4>;
    case 'h5':
      return <h5 {...attributes}>{children}</h5>;
    case 'h6':
      return <h6 {...attributes}>{children}</h6>;
    case 'img':
      return <ImageEditor {...(editorProps as EditorProps<ContentModel.Image>)} />;
    case 'ol':
      return <ol {...attributes}>{children}</ol>;
    case 'ul':
      return <ul {...attributes}>{children}</ul>;
    case 'li':
      return <li {...attributes}>{children}</li>;
    case 'blockquote':
      return <BlockQuoteEditor {...(editorProps as EditorProps<ContentModel.Blockquote>)} />;
    case 'youtube':
      return <YouTubeEditor {...(editorProps as EditorProps<ContentModel.YouTube>)} />;
    case 'iframe':
      return <WebpageEditor {...(editorProps as EditorProps<ContentModel.Webpage>)} />;
    case 'a':
      return <LinkEditor {...(editorProps as EditorProps<ContentModel.Hyperlink>)} />;
    case 'popup':
      return <PopupEditor {...(editorProps as EditorProps<ContentModel.Popup>)} />;
    case 'audio':
      return <AudioEditor {...(editorProps as EditorProps<ContentModel.Audio>)} />;
    case 'code':
      return <CodeEditor {...(editorProps as EditorProps<ContentModel.Code>)} />;
    case 'code_line':
      return <span {...attributes}>{props.children}</span>;
    case 'table':
      return <TableEditor {...(editorProps as EditorProps<ContentModel.Table>)} />;
    case 'tr':
      return <TrEditor {...(editorProps as EditorProps<ContentModel.TableRow>)} />;
    case 'td':
      return <TdEditor {...(editorProps as EditorProps<ContentModel.TableData>)} />;
    case 'th':
      return <ThEditor {...(editorProps as EditorProps<ContentModel.TableHeader>)} />;
    case 'math':
    case 'math_line':
      return <span {...attributes}>Not implemented</span>;
    case 'input_ref':
      return <InputRefEditor {...(editorProps as EditorProps<ContentModel.InputRef>)} />;
    default:
      return <span>{children}</span>;
  }
}

export function markFor(mark: Mark, children: any): JSX.Element {
  switch (mark) {
    case 'em':
      return <em>{children}</em>;
    case 'strong':
      return <strong>{children}</strong>;
    case 'del':
      return <del>{children}</del>;
    case 'mark':
      return <mark>{children}</mark>;
    case 'code':
      return <code>{children}</code>;
    case 'var':
      return <var>{children}</var>;
    case 'sub':
      return <sub>{children}</sub>;
    case 'sup':
      return <sup>{children}</sup>;
    case 'strikethrough':
      return <span style={{ textDecoration: 'line-through' }}>{children}</span>;
    case 'underline':
      return <span style={{ textDecoration: 'underline' }}>{children}</span>;
    default:
      return <span>{children}</span>;
  }
}
