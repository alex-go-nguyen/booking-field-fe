import { FC } from 'react';
import { MessageDescriptor } from 'react-intl';
import { FormattedMessage, useIntl } from 'react-intl';

import en_US from './en-US';
import vi from './vi';

export type Locale = 'vi' | 'en_US';

export const localeConfig = {
  en_US: en_US,
  vi: vi,
};

type Id = keyof typeof en_US;

interface Props extends MessageDescriptor {
  id: Id;
}

export const LocaleFormatter: FC<Props> = ({ ...props }) => {
  const notChildProps = { ...props, children: undefined };

  return <FormattedMessage {...notChildProps} id={props.id} />;
};

type FormatMessageProps = (descriptor: Props) => string;

export const useLocale = () => {
  const { formatMessage: _formatMessage, ...rest } = useIntl();
  const formatMessage: FormatMessageProps = _formatMessage;

  return {
    ...rest,
    formatMessage,
  };
};