import { CommandDesc } from 'components/editing/elements/commands/interfaces';
import { ButtonContent } from 'components/editing/toolbar/buttons/shared';
import { useToolbar } from 'components/editing/toolbar/useToolbar';
import React, { PropsWithChildren } from 'react';
import { Popover } from 'react-tiny-popover';
import { useSlate } from 'slate-react';
import { classNames } from 'utils/classNames';

interface Props {
  description: CommandDesc;
}
export const DropdownButton = (props: PropsWithChildren<Props>) => {
  const thisDropdown = React.useRef<HTMLButtonElement | null>(null);
  const toolbar = useToolbar();
  const editor = useSlate();

  const isOpen = React.useMemo(
    () => !!thisDropdown.current && toolbar.submenu?.current === thisDropdown.current,
    [thisDropdown.current, toolbar.submenu],
  );

  const content = React.useMemo(
    () => <div className="editorToolbar__dropdownGroup">{props.children}</div>,
    [props.children],
  );

  const onClick = React.useCallback(
    (e) => {
      isOpen ? toolbar.closeSubmenus() : toolbar.openSubmenu(thisDropdown as any);
      e.stopPropagation();
    },
    [toolbar, thisDropdown],
  );

  return (
    <Popover
      ref={thisDropdown}
      onClickOutside={toolbar.closeSubmenus}
      isOpen={isOpen}
      padding={8}
      positions={['bottom']}
      reposition={true}
      align={'start'}
      content={content}
    >
      <button
        className={classNames([
          'editorToolbar__button',
          'editorToolbar__button--dropdown',
          props.description.active?.(editor) && 'active',
        ])}
        onClick={onClick}
      >
        <ButtonContent {...props} />
      </button>
    </Popover>
  );
};
