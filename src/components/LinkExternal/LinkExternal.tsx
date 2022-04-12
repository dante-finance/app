import React from 'react';

interface LinkExternalProps extends React.HTMLProps<HTMLAnchorElement> {}

export const LinkExternal = React.forwardRef<HTMLAnchorElement, LinkExternalProps>((props, ref) => {
  const { children, ...rest } = props;

  return (
    <a {...rest} ref={ref} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
});
