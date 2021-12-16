import { LoadingSpinner, LoadingSpinnerSize } from 'components/common/LoadingSpinner';
import { SimpleButton } from 'components/editing/toolbar/buttons/SimpleButton';
import { ToolbarDropdown } from 'components/editing/toolbar/buttons/ToolbarDropdown';
import { ToolbarItem, ButtonContext } from 'components/editing/toolbar/interfaces';
import React, { useRef, useState } from 'react';
import { ArrowContainer, Popover } from 'react-tiny-popover';
import { useFocused, useSlate } from 'slate-react';
import { classNames } from 'utils/classNames';
import guid from 'utils/guid';
import { shouldShowInsertionToolbar } from './utils';

type InsertionToolbarProps = {
  isPerformingAsyncAction: boolean;
  toolbarItems: ToolbarItem[];
  commandContext: ButtonContext;
};

function insertionAreEqual(prevProps: InsertionToolbarProps, nextProps: InsertionToolbarProps) {
  return (
    prevProps.commandContext === nextProps.commandContext &&
    prevProps.toolbarItems === nextProps.toolbarItems &&
    prevProps.isPerformingAsyncAction === nextProps.isPerformingAsyncAction
  );
}
export const InsertionToolbar: React.FC<InsertionToolbarProps> = React.memo((props) => {
  const { toolbarItems } = props;
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlate();
  const focused = useFocused();
  const id = guid();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // useEffect(() => {
  //   const el = ref.current;
  //   if (!el) return;

  //   const reposition = () => positionInsertion(el, editor);
  //   if (!isPopoverOpen) {
  //     hideToolbar(el);
  //   }

  //   if (isPopoverOpen || (focused && shouldShowInsertionToolbar(editor))) {
  //     reposition();
  //     showToolbar(el);
  //   } else {
  //     hideToolbar(el);
  //   }

  //   window.addEventListener('resize', reposition);
  //   return () => {
  //     hideToolbar(el);
  //     window.removeEventListener('resize', reposition);
  //   };
  // });

  if (!isPopoverOpen && !shouldShowInsertionToolbar(editor)) {
    return null;
  }

  return (
    <div
      style={{ display: 'none' }}
      ref={ref}
      id={id}
      className={classNames(['toolbar add-resource-content', isPopoverOpen ? 'active' : ''])}
    >
      <div className="insert-button-container">
        <Popover
          containerClassName="add-resource-popover"
          onClickOutside={(_e) => setIsPopoverOpen(false)}
          isOpen={isPopoverOpen}
          align="center"
          padding={5}
          reposition={false}
          positions={['top']}
          boundaryElement={document.body}
          parentElement={ref.current || undefined}
          content={({ position, childRect, popoverRect }) => (
            <ArrowContainer
              position={position}
              childRect={childRect}
              popoverRect={popoverRect}
              arrowSize={8}
              arrowColor="rgb(38,38,37)"
              // Position the arrow in the middle of the popover
              arrowStyle={{ left: popoverRect.width / 2 - 8 }}
            >
              <div className="hovering-toolbar">
                <div className="btn-group btn-group-vertical btn-group-sm" role="group">
                  {[
                    ...toolbarItems.map((t, i) => {
                      if (t.type !== 'ToolbarButtonDesc') {
                        return <Spacer key={'spacer-' + i} />;
                      }
                      if (!t.command.precondition(editor)) {
                        return null;
                      }

                      const shared = {
                        style: 'btn-dark',
                        key: t.description(editor),
                        icon: t.icon(editor),
                        description: t.description(editor),
                        command: t.command,
                        context: props.commandContext,
                        parentElement: id,
                        setParentPopoverOpen: setIsPopoverOpen,
                      };

                      if (t.command.obtainParameters === undefined) {
                        return <SimpleButton {...shared} />;
                      }
                      // eslint-disable-next-line
                      return <ToolbarDropdown {...shared} />;
                    }),
                  ].filter((x) => x)}
                </div>
              </div>
            </ArrowContainer>
          )}
        >
          <div className="insert-button" onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
            {props.isPerformingAsyncAction ? (
              <LoadingSpinner size={LoadingSpinnerSize.Normal} />
            ) : (
              <i className="fa fa-plus"></i>
            )}
          </div>
        </Popover>
      </div>
    </div>
  );
}, insertionAreEqual);
InsertionToolbar.displayName = 'InsertionToolbar';

const Spacer = () => {
  return <span style={{ minWidth: '5px', maxWidth: '5px' }} />;
};
