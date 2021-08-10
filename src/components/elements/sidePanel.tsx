import React from 'react';
import {
  SideSheet,
  Heading,
  Pane,
  Card,
  Button,
  Paragraph,
} from 'evergreen-ui';

type SidePanelPropsType = {
  name: string;
  description?: string;
  show: boolean;
  setShow: (value: boolean) => void;
  onSave?: () => void;
  children: React.ReactNode;
  renderSaveButton?: boolean;
};

const defaultProps = {
  description: null,
  onSave: null,
  renderSaveButton: true,
};

const SidePanel = ({
  name,
  description = null,
  show,
  setShow,
  onSave,
  children,
  renderSaveButton = true,
}: SidePanelPropsType) => {
  return (
    <div>
      <SideSheet
        isShown={show}
        onCloseComplete={() => setShow(false)}
        containerProps={{
          display: 'flex',
          flex: '1',
          flexDirection: 'column',
        }}>
        <Pane
          display="flex"
          zIndex={1}
          flexShrink={0}
          elevation={0}
          backgroundColor="white">
          <Pane
            padding={16}
            flex={1}
            alignItems="center"
            display="flex"
            borderBottom="muted">
            <Heading size={600}>{name}</Heading>
            {description && (
              <Paragraph size={400} color="muted">
                {description}
              </Paragraph>
            )}
          </Pane>
          {renderSaveButton && (
            <Pane
              padding={16}
              alignItems="center"
              display="flex"
              borderBottom="muted">
              <Button appearance="primary" onClick={onSave}>
                Save
              </Button>
            </Pane>
          )}
        </Pane>
        <Pane flex="1" overflowY="scroll" background="tint1" padding={16}>
          <Card
            backgroundColor="white"
            elevation={0}
            display="flex"
            alignItems="center"
            paddingY={50}
            justifyContent="center">
            {children}
          </Card>
        </Pane>
      </SideSheet>
    </div>
  );
};

SidePanel.defaultProps = defaultProps;
export default SidePanel;
