import React, { PropsWithChildren, useEffect, useState } from 'react';
import * as Immutable from 'immutable';
import isHotkey from 'is-hotkey';
import { throttle } from 'lodash';
import { classNames, ClassName } from 'utils/classNames';
import styles from './ContentOutline.modules.scss';
import {
  StructuredContent,
  ActivityReference,
  ResourceContent,
  ContentPurposes,
} from 'data/content/resource';
import { ActivityEditContext } from 'data/content/activity';
import { ActivityBankSelection } from 'data/content/resource';
import { getContentDescription } from 'data/content/utils';
import { DragHandle } from 'components/resource/DragHandle';
import { focusHandler } from './dragndrop/handlers/focus';
import { moveHandler } from './dragndrop/handlers/move';
import { dragEndHandler } from './dragndrop/handlers/dragEnd';
import { dropHandler, scrollToResourceEditor } from './dragndrop/handlers/drop';
import { getDragPayload } from './dragndrop/utils';
import { dragStartHandler } from './dragndrop/handlers/dragStart';
import { DropTarget } from './dragndrop/DropTarget';
import { ActivityEditorMap } from 'data/content/editors';
import { ProjectSlug } from 'data/types';
import { getViewportHeight } from 'utils/browser';

const getActivityDescription = (activity: ActivityEditContext) => {
  return activity.model.authoring?.previewText || <i>No content</i>;
};

const getContentTitle = (item: StructuredContent) => {
  if (item.purpose === 'none') {
    return 'Paragraph';
  }

  return ContentPurposes.find((p) => p.value === item.purpose)?.label;
};

const getActivitySelectionTitle = (_selection: ActivityBankSelection) => {
  return 'Activity Bank Selection';
};

const getActivitySelectionDescription = (selection: ActivityBankSelection) => {
  return `${selection.count} selection${selection.count > 1 ? 's' : ''}`;
};

const calculateOutlineHeight = (scrollOffset: number) => {
  const topMargin = 420;
  const scrolledMargin = 200;
  const minHeight = 220;
  const scrollCompensation = Math.max(topMargin - scrollOffset, scrolledMargin);
  return Math.max(getViewportHeight() - scrollCompensation, minHeight);
};

const EDITOR_SHOW_OUTLINE_KEY = 'editorShowOutline';
const loadShowOutlineState = () => localStorage.getItem(EDITOR_SHOW_OUTLINE_KEY) === 'true';

interface ContentOutlineProps {
  className?: ClassName;
  editMode: boolean;
  content: Immutable.OrderedMap<string, ResourceContent>;
  activityContexts: Immutable.Map<string, ActivityEditContext>;
  editorMap: ActivityEditorMap;
  projectSlug: ProjectSlug;
  onEditContentList: (content: Immutable.OrderedMap<string, ResourceContent>) => void;
}

export const ContentOutline = ({
  className,
  editMode,
  content,
  activityContexts,
  editorMap,
  projectSlug,
  onEditContentList,
}: ContentOutlineProps) => {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [assistive, setAssistive] = useState('');
  const [scrollPos, setScrollPos] = useState(0);
  const [height, setHeight] = useState(calculateOutlineHeight(scrollPos));
  const [showOutline, setShowOutlineState] = useState(loadShowOutlineState());

  const setShowOutline = (show: boolean) => {
    localStorage.setItem(EDITOR_SHOW_OUTLINE_KEY, show.toString());
    setShowOutlineState(show);
  };

  // adjust the height of the content outline when the window is resized
  useEffect(() => {
    const handleResize = throttle(() => setHeight(calculateOutlineHeight(scrollPos)), 200);
    window.addEventListener('resize', handleResize);

    const handleScroll = throttle(() => {
      setScrollPos(document.documentElement.scrollTop);
      setHeight(calculateOutlineHeight(document.documentElement.scrollTop));
    }, 200);
    document.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPos]);

  // register keydown handlers
  const isShiftArrowDown = isHotkey('shift+down');
  const isShiftArrowUp = isHotkey('shift+up');

  const isReorderMode = activeDragId !== null;
  const activeDragIndex = content
    .entrySeq()
    .findIndex(([id, _contentItem], _index) => id == activeDragId);
  const onDragEnd = dragEndHandler(setActiveDragId);
  const onDrop = dropHandler(content, onEditContentList, projectSlug, onDragEnd, editMode);

  const items = [
    ...content
      .entrySeq()
      .filter(([id, _contentItem], _index) => id !== activeDragId)
      .map(([id, contentItem], index) => {
        const onFocus = focusHandler(setAssistive, content, editorMap, activityContexts);
        const onMove = moveHandler(
          content,
          onEditContentList,
          editorMap,
          activityContexts,
          setAssistive,
        );

        const handleKeyDown = (id: string) => (e: React.KeyboardEvent<HTMLDivElement>) => {
          if (isShiftArrowDown(e.nativeEvent)) {
            onMove(id, false);
            setTimeout(() => document.getElementById(`content-item-${id}`)?.focus());
          } else if (isShiftArrowUp(e.nativeEvent)) {
            onMove(id, true);
            setTimeout(() => document.getElementById(`content-item-${id}`)?.focus());
          }
        };

        const dragPayload = getDragPayload(contentItem, activityContexts, projectSlug);
        const onDragStart = dragStartHandler(dragPayload, contentItem, setActiveDragId);

        // adjust for the fact that the item being dragged is filtered out of the rendered elements
        const dropIndex = index >= activeDragIndex ? index + 1 : index;

        return (
          <>
            {isReorderMode && <DropTarget id={id} index={dropIndex} onDrop={onDrop} />}

            <div
              id={`content-item-${id}`}
              className={classNames(styles.item, className)}
              draggable={editMode}
              tabIndex={0}
              onDragStart={(e) => onDragStart(e, id)}
              onDragEnd={onDragEnd}
              onKeyDown={handleKeyDown(id)}
              onFocus={(_e) => onFocus(id)}
              onClick={() => scrollToResourceEditor(id)}
              role="button"
              aria-label={assistive}
            >
              <DragHandle style={{ margin: '10px 10px 10px 0' }} />
              {renderItem(contentItem, activityContexts)}
            </div>
          </>
        );
      }),
    isReorderMode && <DropTarget id="last" index={content.size || 0} onDrop={onDrop} />,
  ];

  return (
    <div
      className={classNames(
        styles.contentOutlineContainer,
        showOutline && styles.contentOutlineContainerShow,
      )}
    >
      {showOutline ? (
        <div className={classNames(styles.contentOutline, className)}>
          <Header onHideOutline={() => setShowOutline(false)} />
          <div
            className={classNames(
              styles.contentOutlineItems,
              isReorderMode && styles.contentOutlineItemsReorderMode,
            )}
            style={{ maxHeight: height }}
          >
            {items}
          </div>
        </div>
      ) : (
        <div className={styles.contentOutlineToggleSticky}>
          <div className={styles.contentOutlineToggle}>
            <button
              className={classNames(styles.contentOutlineToggleButton)}
              onClick={() => setShowOutline(true)}
            >
              <i className="fa fa-angle-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const renderItem = (
  item: ResourceContent,
  activityContexts: Immutable.Map<string, ActivityEditContext>,
) => {
  switch (item.type) {
    case 'content':
      return (
        <>
          <Icon iconName="las la-paragraph" />
          <Description title={getContentTitle(item)}>{getContentDescription(item)}</Description>
        </>
      );

    case 'selection':
      return (
        <>
          <Icon iconName="las la-cogs" />
          <Description title={getActivitySelectionTitle(item)}>
            {getActivitySelectionDescription(item)}
          </Description>
        </>
      );

    case 'activity-reference':
      const activity = activityContexts.get((item as ActivityReference).activitySlug);

      if (activity) {
        return (
          <>
            <Icon iconName="las la-shapes" />
            <Description title={activity?.title}>{getActivityDescription(activity)}</Description>
          </>
        );
      } else {
        return <div className="text-danger">An Unknown Error Occurred</div>;
      }

    case 'group':
      return <>Group</>;

    default:
      return <>Unknown</>;
  }
};

interface HeaderProps {
  onHideOutline: () => void;
}

const Header = ({ onHideOutline }: HeaderProps) => (
  <div className={styles.header}>
    <button className={classNames(styles.headerButton)} onClick={onHideOutline}>
      <i className="fa fa-angle-left"></i>
    </button>
  </div>
);

interface IconProps {
  iconName: string;
}

const Icon = ({ iconName }: IconProps) => (
  <div className={styles.icon}>
    <i className={iconName}></i>
  </div>
);

interface DescriptionProps {
  title?: string;
}

const Description = ({ title, children }: PropsWithChildren<DescriptionProps>) => (
  <div className={styles.description}>
    <div className={styles.title}>{title}</div>
    <div className={styles.descriptionContent}>{children}</div>
  </div>
);